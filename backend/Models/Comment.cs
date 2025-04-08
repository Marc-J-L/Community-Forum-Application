﻿// using Google.Cloud.Firestore;
// namespace backend.Models
// {
//     [FirestoreData]
//     public class Comment
//     {
//         [FirestoreDocumentId]
//         public string Id { get; set; }             // Unique ID for the comment
        
//         [FirestoreProperty]
//         public string PostId { get; set; }          // ID of the post this comment is related to
        
//         [FirestoreProperty]
//         public string UserId { get; set; }          // ID of the user who posted the comment
        
//         [FirestoreProperty]
//         public string Content { get; set; }         // The content of the comment
        
//         [FirestoreProperty]
//         public Timestamp CreatedAt { get; set; }     // The date and time when the comment was created
        
//         [FirestoreProperty]
//         public Timestamp? UpdatedAt { get; set; }
//     }
// }


using Google.Cloud.Firestore;

namespace backend.Models
{
    [FirestoreData]
    public class Comment
    {
        [FirestoreDocumentId]
        public string Id { get; set; } // Unique ID for the comment
        
        [FirestoreProperty]
        public string PostId { get; set; } // ID of the post this comment is related to
        
        [FirestoreProperty]
        public string UserId { get; set; } // ID of the user who posted the comment
        
        [FirestoreProperty]
        public string Content { get; set; } // The content of the comment
        
        [FirestoreProperty]
        public Timestamp CreatedAt { get; set; } // The date and time when the comment was created
        
        [FirestoreProperty]
        public Timestamp? UpdatedAt { get; set; } // The date and time when the comment was last updated (nullable)
    }
}
