using Google.Cloud.Firestore;

namespace backend.Models
{
    [FirestoreData]
    public class UserCommunity
    {
        [FirestoreDocumentId]
        public string Id { get; set; }

        [FirestoreProperty]
        public string UserId { get; set; }  // ID of the user

        [FirestoreProperty]
        public string CommunityId { get; set; }  // ID of the community

        [FirestoreProperty]
        public bool IsStarred { get; set; } = false;

        [FirestoreProperty]
        public bool IsCreator { get; set; } = false;

        [FirestoreProperty]
        public Timestamp CreatedAt { get; set; } 
    }
}
