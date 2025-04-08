// Services/FriendRequestService.cs
using Google.Cloud.Firestore;
using backend.Models;
using backend.DTOs.FriendRequest;


namespace backend.Services
{
    public class FriendRequestService
    {
        private readonly FirestoreDb _db;
        private readonly UserService _userService;
        private readonly FriendshipService _friendshipService;

        public FriendRequestService(FirestoreDb config, UserService userService, FriendshipService friendshipService)
        {
            _db = config;
            _userService = userService;
            _friendshipService = friendshipService;
        }

        private async Task<FriendRequestWithUserInfoDto> PopulateUserInfoAsync(DocumentSnapshot documentSnapshot, string field)
        {
            var friendRequest = documentSnapshot.ConvertTo<FriendRequest>();
            var user = await _userService.GetUserAsync(typeof(FriendRequest).GetProperty(field).GetValue(friendRequest).ToString());

            if (user == null)
            {
                throw new InvalidOperationException("user_not_found");
            }

            return new FriendRequestWithUserInfoDto
            {
                Id = friendRequest.Id,        
                Status = friendRequest.Status,
                CreatedAt = friendRequest.CreatedAt,
                user = user,
            };
        }

        public async Task<FriendRequest> GetFriendRequestAsync(string id)
        {
            DocumentReference docRef = _db.Collection("friend_requests").Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (snapshot.Exists)
            {
                return snapshot.ConvertTo<FriendRequest>();
            }
            return null;
        }

        private async Task<QuerySnapshot> GetQuerySnapshotByUserIdAsync(string fieldName, string userId)
        {
            Query query = _db.Collection("friend_requests").WhereEqualTo(fieldName, userId);

            if (fieldName.Equals("ReceiverId"))
            {
                query = query.WhereIn("Status", new[] { "Pending", "Accepted", "Rejected" });
            }

            return await query.GetSnapshotAsync();
        }

        public async Task<List<FriendRequestWithUserInfoDto>> GetFriendRequestsBySenderIdAsync(string senderId)
        {
            var snapshots = await GetQuerySnapshotByUserIdAsync("SenderId", senderId);
            var response = new List<FriendRequestWithUserInfoDto>();

            foreach (var snapshot in snapshots)
            {
                var friendRequest = await PopulateUserInfoAsync(snapshot, "ReceiverId");
                response.Add(friendRequest);
            }

            return response.OrderByDescending(r => r.CreatedAt)
                        .OrderBy(r => r.Status == "Pending" ? 0 : 1)
                        .ToList();
        }

        public async Task<List<FriendRequestWithUserInfoDto>> GetFriendRequestsByReceiverIdAsync(string receiverId)
        {
            var snapshots = await GetQuerySnapshotByUserIdAsync("ReceiverId", receiverId);
            var response = new List<FriendRequestWithUserInfoDto>();

            foreach (var snapshot in snapshots)
            {
                var friendRequest = await PopulateUserInfoAsync(snapshot, "SenderId");
                response.Add(friendRequest);
            }

            return response.OrderByDescending(r => r.CreatedAt)
                      .OrderBy(r => r.Status == "Pending" ? 0 : 1)
                      .ToList();
        }

        public async Task<IEnumerable<FriendRequest>> GetAllFriendRequestsAsync()
        {
            QuerySnapshot snapshot = await _db.Collection("friend_requests").GetSnapshotAsync();
            var friendRequests = new List<FriendRequest>();

            foreach (DocumentSnapshot document in snapshot.Documents)
            {
                friendRequests.Add(document.ConvertTo<FriendRequest>());
            }

            return friendRequests;
        }

        public async Task AddFriendRequestAsync(string senderId, string receiverId)
        {
            // Check if the user is trying to send a friend request to themselves
            if (senderId == receiverId)
            {
                throw new InvalidOperationException("cannot_send_to_self");
            }

            // Check if the receiver exists
            DocumentReference receiverRef = _db.Collection("users").Document(receiverId);
            DocumentSnapshot receiverSnapshot = await receiverRef.GetSnapshotAsync();

            if (!receiverSnapshot.Exists)
            {
                throw new InvalidOperationException("user_not_found");
            }

            // Check if friendship already exists
            string friendshipId1 = $"{senderId}_{receiverId}";
            string friendshipId2 = $"{receiverId}_{senderId}";

            DocumentReference friendshipRef1 = _db.Collection("friendships").Document(friendshipId1);
            DocumentReference friendshipRef2 = _db.Collection("friendships").Document(friendshipId2);

            DocumentSnapshot friendshipSnapshot1 = await friendshipRef1.GetSnapshotAsync();
            DocumentSnapshot friendshipSnapshot2 = await friendshipRef2.GetSnapshotAsync();

            if (friendshipSnapshot1.Exists && friendshipSnapshot2.Exists)
            {
                throw new InvalidOperationException("friendship_exists");
            }

            // Check for existing friend requests
            Query query = _db.Collection("friend_requests")
                .WhereEqualTo("SenderId", senderId)
                .WhereEqualTo("ReceiverId", receiverId)
                .WhereEqualTo("Status", "Pending");

            QuerySnapshot querySnapshot = await query.GetSnapshotAsync();

            if (querySnapshot.Documents.Count > 0)
            {
                throw new InvalidOperationException("friend_request_exists");
            }

            // Generate a new document reference
            DocumentReference docRef = _db.Collection("friend_requests").Document();

            // Set the generated ID to the friend request object
            var newRequest = new FriendRequest
            {
                Id = docRef.Id,
                SenderId = senderId,
                ReceiverId = receiverId,
                CreatedAt = Timestamp.GetCurrentTimestamp(),
                Status = "Pending",
            };

            await docRef.SetAsync(newRequest);
        }


        public async Task UpdateFriendRequestAsync(string id, FriendRequest friendRequest)
        {
            DocumentReference docRef = _db.Collection("friend_requests").Document(id);
            await docRef.SetAsync(friendRequest, SetOptions.MergeAll);

            if (friendRequest.Status.Equals("Accepted"))
            {
                await _friendshipService.AddFriendAsync(friendRequest.SenderId, friendRequest.ReceiverId);
            }
        }

        public async Task DeleteFriendRequestAsync(string id)
        {
            DocumentReference docRef = _db.Collection("friend_requests").Document(id);
            await docRef.DeleteAsync();
        }
    }
}
