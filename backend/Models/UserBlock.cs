using Google.Cloud.Firestore;

namespace backend.Models
{
    [FirestoreData]
    public class UserBlock
    {
        [FirestoreDocumentId]
        public string Id { get; set; } 

        [FirestoreProperty]
        public string BlockingUserId { get; set; }  // ID of the user blocking

        [FirestoreProperty]
        public string BlockedUserId { get; set; }  // ID of the user being blocked
    }
}
