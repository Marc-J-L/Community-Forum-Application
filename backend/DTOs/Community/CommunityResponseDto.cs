using Google.Cloud.Firestore;

namespace backend.DTOs.Community
{
    public class CommunityResponseDto
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public int UserCount { get; set; }

        public Timestamp CreatedAt { get; set; }

        public string Visibility { get; set; }
    }
}
