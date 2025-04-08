using backend.DTOs.Users;
using Google.Cloud.Firestore;

namespace backend.DTOs.Friendship
{
    public class FriendshipWithUserInfoDto
    {
        public string Id { get; set; }  // Unique ID for this relationship

        public bool IsCloseFriend { get; set; }

        public Timestamp CreatedAt { get; set; }

        public UserInfoDto Friend { get; set; }
    }
}
