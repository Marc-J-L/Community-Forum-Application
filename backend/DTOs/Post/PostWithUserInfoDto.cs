using backend.DTOs.Users;
using Google.Cloud.Firestore;

namespace backend.DTOs.Posts
{
    public class PostWithUserInfoDto
    {
        public string Id { get; set; }

        public string Title { get; set; }

        public string Content { get; set; }

        public string Visibility { get; set; }

        public List<string> ImageUrls { get; set; }

        public Timestamp CreatedAt { get; set; }

        public Timestamp UpdatedAt { get; set; }

        public UserInfoDto Author { get; set; }
    }
}
