using Google.Cloud.Firestore;

namespace backend.Models
{
    [FirestoreData]
    public class UserLike
    {
        [FirestoreDocumentId]
        public string Id { get; set; } 

        [FirestoreProperty]
        public string UserId { get; set; }  // ID of the user

        [FirestoreProperty]
        public string PostId { get; set; }  // ID of the liked post
    }
}
