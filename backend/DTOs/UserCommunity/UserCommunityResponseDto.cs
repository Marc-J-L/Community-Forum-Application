using Google.Cloud.Firestore;

namespace backend.DTOs.UserCommunity
{
    public class UserCommunityResponseDto
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public int UserCount { get; set; }

        public Timestamp CreatedAt { get; set; }

        public bool IsStarred { get; set; }

        public bool IsCreator { get; set; }
    }
}
