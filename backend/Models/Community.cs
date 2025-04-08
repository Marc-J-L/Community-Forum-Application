using Google.Cloud.Firestore;

namespace backend.Models
{
    [FirestoreData]
    public class Community
    {
        [FirestoreDocumentId]
        public string Id { get; set; } 

        [FirestoreProperty]
        public string Name { get; set; }

        [FirestoreProperty]
        public string Description { get; set; }

        [FirestoreProperty]
        public int UserCount { get; set; }

        [FirestoreProperty]
        public Timestamp CreatedAt { get; set; }

        [FirestoreProperty]
        public string UserId { get; set; }  // Id of the user who created this community

        [FirestoreProperty]
        public string Visibility { get; set; }  // "Public", "Private"
    }
}
