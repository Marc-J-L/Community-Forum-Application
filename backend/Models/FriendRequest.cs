using Google.Cloud.Firestore;
namespace backend.Models
{
    [FirestoreData]
    public class FriendRequest
    {
        [FirestoreDocumentId]
        public string Id { get; set; } 
        
        [FirestoreProperty]
        public string SenderId { get; set; }
        
        [FirestoreProperty]
        public string ReceiverId { get; set; }
        
        [FirestoreProperty]
        public Timestamp CreatedAt { get; set; }

        [FirestoreProperty]
        public string Status { get; set; } = "Pending"; 
    }
}

