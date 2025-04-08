using Google.Cloud.Firestore;
namespace backend.Models
{
    [FirestoreData]
    public class Friendship
    {
        [FirestoreDocumentId]
        public string Id { get; set; }  // Unique ID for this relationship

        [FirestoreProperty]
        public string UserId { get; set; }  // ID of the user
        
        [FirestoreProperty]
        public string FriendId { get; set; }  // ID of the friend
        
        [FirestoreProperty]
        public bool IsCloseFriend { get; set; } = false;

        [FirestoreProperty]
        public Timestamp CreatedAt { get; set; } 
    }
}
