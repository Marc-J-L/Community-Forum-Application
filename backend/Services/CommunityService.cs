using backend.DTOs.Community;
using backend.Models;
using Google.Cloud.Firestore;

namespace backend.Services
{
    public class CommunityService
    {
        private readonly FirestoreDb _firestoreDb;
        private readonly UserService _userService;
        private readonly FirebaseAuthService _firebaseAuthService;

        public CommunityService(FirestoreDb firestoreDb, UserService userService, FirebaseAuthService firebaseAuthService)
        {
            _firestoreDb = firestoreDb;
            _userService = userService;
            _firebaseAuthService = firebaseAuthService;
        }

        private async Task<QuerySnapshot> GetQuerySnapshotAsync(Dictionary<string, object> filters = null)
        {
            Query query = _firestoreDb.Collection("communities");

            if (filters != null)
            {
                foreach (var filter in filters)
                {
                    query = query.WhereEqualTo(filter.Key, filter.Value);
                }
            }

            return await query.GetSnapshotAsync();
        }

        private async Task<CommunityWithUserInfoDto> PopulateUserInfoAsync(DocumentSnapshot documentSnapshot)
        {
            var community = documentSnapshot.ConvertTo<Community>();
            var user = await _userService.GetUserAsync(community.UserId);

            return new CommunityWithUserInfoDto
            {
                Id = community.Id,
                Name = community.Name,
                Description = community.Description,
                UserCount = community.UserCount,
                CreatedAt = community.CreatedAt,
                Visibility = community.Visibility,
                CreatedBy = user,
            };
        }

        public async Task<List<CommunityWithUserInfoDto>> GetPublicCommunitiesAsync()
        {
            var results = new List<CommunityWithUserInfoDto>();

            var filter = new Dictionary<string, object> { { "Visibility", "Public" } };
            var snapshot = await GetQuerySnapshotAsync(filter);

            foreach (var item in snapshot) {
                var communityWithUserInfo = await PopulateUserInfoAsync(item);
                results.Add(communityWithUserInfo);
            }
            
            return results;
        }

        public async Task<List<CommunityResponseDto>> GetCommunitiesByCreatorAsync(string userId)
        {
            var filter = new Dictionary<string, object> { { "UserId", userId } };
            var snapshot = await GetQuerySnapshotAsync(filter);

            return snapshot.Documents
                 .Select(doc => doc.ConvertTo<CommunityResponseDto>())
                 .ToList();
        }

        public async Task<CommunityWithUserInfoDto?> GetCommunityAsync(string id)
        {
            DocumentReference docRef = _firestoreDb.Collection("communities").Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            return snapshot.Exists ? await PopulateUserInfoAsync(snapshot) : null;
        }

        public async Task CreateCommunityAsync(string userId, CommunityCreateDto communityCreateData)
        {
            await _firestoreDb.RunTransactionAsync(async transaction =>
            {
                var userId = _firebaseAuthService.GetUserId();

                Query query = _firestoreDb.Collection("communities").WhereEqualTo("Name", communityCreateData.Name);
                QuerySnapshot querySnapshot = await query.GetSnapshotAsync();

                if (querySnapshot.Count > 0)
                {
                    throw new Exception("community_name_exists");
                }

                DocumentReference newCommunityRef = _firestoreDb.Collection("communities").Document();
                var newCommunityId = newCommunityRef.Id;

                DocumentReference newUserCommunityRef = _firestoreDb.Collection("user_communities").Document($"{userId}_{newCommunityId}");

                var timestamp = Timestamp.GetCurrentTimestamp();

                var newCommunity = new Community
                {
                    Id = newCommunityId,
                    Name = communityCreateData.Name,
                    Description = communityCreateData.Description,
                    UserCount = 1,
                    CreatedAt = timestamp,
                    Visibility = communityCreateData.Visibility,
                    UserId = userId,
                };

                var newUserCommunity = new UserCommunity
                {
                    Id = $"{userId}_{newCommunityId}",
                    UserId = userId,
                    CommunityId = newCommunityId,
                    IsStarred = false,
                    CreatedAt = timestamp,
                    IsCreator = true,
                };

                transaction.Set(newCommunityRef, newCommunity);
                transaction.Set(newUserCommunityRef, newUserCommunity);
            });
        }

        public async Task UpdateCommunityAsync(string communityId, CommunityUpdateDto communityUpdateData)
        {
            DocumentReference docRef = _firestoreDb.Collection("communities").Document(communityId);

            Dictionary<string, object> updates = new Dictionary<string, object>();

            if (!string.IsNullOrEmpty(communityUpdateData.Description))
            {
                updates["Description"] = communityUpdateData.Description;
            }

            if (!string.IsNullOrEmpty(communityUpdateData.Visibility))
            {
                updates["Visibility"] = communityUpdateData.Visibility;
            }

            if (updates.Count > 0)
            {
                await docRef.UpdateAsync(updates);
            }
        }
    }
}
