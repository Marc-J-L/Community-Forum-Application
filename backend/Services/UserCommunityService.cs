using backend.DTOs.Community;
using backend.DTOs.UserCommunity;
using backend.Models;
using Google.Cloud.Firestore;

namespace backend.Services
{
    public class UserCommunityService
    {
        private readonly FirestoreDb _firestoreDb;
        private readonly UserService _userService;
        private readonly CommunityService _communityService;

        public UserCommunityService(FirestoreDb firestoreDb,UserService userService, CommunityService communityService)
        {
            _firestoreDb = firestoreDb;
            _userService = userService;
            _communityService = communityService;
        }

        private async Task<UserCommunityResponseDto> PopulateCommunityInfoAsync(DocumentSnapshot documentSnapshot)
        {
            var userCommunity = documentSnapshot.ConvertTo<UserCommunity>();
            var community = await _communityService.GetCommunityAsync(userCommunity.CommunityId);

            return new UserCommunityResponseDto
            {
                Id = community.Id,
                Name = community.Name,
                Description = community.Description,
                UserCount = community.UserCount,
                CreatedAt = community.CreatedAt,
                IsStarred = userCommunity.IsStarred,
                IsCreator = userCommunity.IsCreator,
            };
        }

        private async Task<QuerySnapshot> GetQuerySnapshotAsync(Dictionary<string, object>? filters = null)
        {
            Query query = _firestoreDb.Collection("user_communities");

            if (filters != null)
            {
                foreach (var filter in filters)
                {
                    query = query.WhereEqualTo(filter.Key, filter.Value);
                }
            }

            return await query.GetSnapshotAsync();
        }

        public async Task<List<UserCommunityResponseDto>> GetUserCommunitiesAsync(string userId, bool? isCreator = null)
        {
            var res = new List<UserCommunityResponseDto>();
            var filter = isCreator == null ? 
                new Dictionary<string, object> { { "UserId", userId } } : 
                new Dictionary<string, object> { { "UserId", userId }, { "IsCreator", isCreator } };

            var snapshot = await GetQuerySnapshotAsync(filter);

            foreach (var item in snapshot)
            {   
                var populated = await PopulateCommunityInfoAsync(item);
                res.Add(populated);
            }

            return res
                .OrderByDescending(c => c.IsStarred)
                .ThenBy(c => c.Name)
                .ToList();
        }

        public async Task<UserCommunityResponseDto> JoinCommunityAsync(string userId, string communityId)
        {
            return await _firestoreDb.RunTransactionAsync(async transaction =>
            {
                DocumentReference userCommunityRef = _firestoreDb.Collection("user_communities").Document($"{userId}_{communityId}");
                DocumentSnapshot snapshot = await transaction.GetSnapshotAsync(userCommunityRef);

                if (snapshot.Exists)
                {
                    throw new Exception("community_already_joined");
                }

                DocumentReference communityRef = _firestoreDb.Collection("communities").Document(communityId);
                DocumentSnapshot communitySnapshot = await transaction.GetSnapshotAsync(communityRef);
                var community = communitySnapshot.ConvertTo<Community>();
                var currentCount = community.UserCount;
                var isCreator = userId == community.UserId;
                var timestamp = Timestamp.GetCurrentTimestamp();

                var userCommunity = new UserCommunity
                {
                    Id = $"{userId}_{communityId}",
                    UserId = userId,
                    CommunityId = communityId,
                    IsStarred = false,
                    CreatedAt = timestamp,
                    IsCreator = isCreator,
                };

                transaction.Set(userCommunityRef, userCommunity);
                transaction.Update(communityRef, "UserCount", currentCount + 1);

                return new UserCommunityResponseDto
                {
                    Id = community.Id,
                    Name = community.Name,
                    Description = community.Description,
                    UserCount = community.UserCount,
                    CreatedAt = community.CreatedAt,
                    IsStarred = userCommunity.IsStarred,
                    IsCreator = isCreator,
                };
            });
        }

        public async Task LeaveCommunityAsync(string userId, string communityId)
        {
            await _firestoreDb.RunTransactionAsync(async transaction =>
            {
                DocumentReference userCommunityRef = _firestoreDb.Collection("user_communities").Document($"{userId}_{communityId}");
                DocumentSnapshot snapshot = await transaction.GetSnapshotAsync(userCommunityRef);

                if (!snapshot.Exists)
                {
                    throw new Exception("community_not_joined");
                }

                DocumentReference communityRef = _firestoreDb.Collection("communities").Document(communityId);
                DocumentSnapshot communitySnapshot = await transaction.GetSnapshotAsync(communityRef);
                var community = communitySnapshot.ConvertTo<Community>();

                if (community.UserId == userId)
                {
                    throw new Exception("creator_cannot_leave");
                }

                transaction.Delete(userCommunityRef);
                transaction.Update(communityRef, "UserCount", community.UserCount - 1);
            });
        }

        public async Task UpdateIsStarredAsync(string userId, string communityId, bool isStarred)
        {
            DocumentReference docRef = _firestoreDb.Collection("user_communities").Document($"{userId}_{communityId}");
            await docRef.UpdateAsync("IsStarred", isStarred);
        }
    }
}
