using backend.DTOs.Users;
using Google.Cloud.Firestore;

namespace backend.DTOs.FriendRequest
{
    public class FriendRequestWithUserInfoDto
    {
        public string Id { get; set; }

        public Timestamp CreatedAt { get; set; }

        public string Status { get; set; }

        public UserInfoDto user { get; set; }
    }
}
