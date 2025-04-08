using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;

namespace backend.Models
{
    [FirestoreData]
    public class Post
    {
        [FirestoreDocumentId]
        public string PostId { get; set; }
        
        [FirestoreProperty]
        public string AuthorId { get; set; }

        [FirestoreProperty]
        public string CommunityId { get; set; }

        [FirestoreProperty]
        public string Title { get; set; }

        [FirestoreProperty]
        public string Text { get; set; }

        [FirestoreProperty]
        public List<string> Images { get; set; }

        [FirestoreProperty]
        public string AuthorName { get; set; }

        [FirestoreProperty]
        public string AuthorImg { get; set; }

        // Ensure CreatedAt is always in UTC
        private DateTime _createdAt;
        [FirestoreProperty]
        public DateTime CreatedAt
        {
            get => _createdAt;
            set => _createdAt = value.Kind == DateTimeKind.Utc ? value : value.ToUniversalTime();
        }

        // Ensure UpdatedAt is nullable and in UTC
        private DateTime? _updatedAt;
        [FirestoreProperty]
        public DateTime? UpdatedAt
        {
            get => _updatedAt;
            set => _updatedAt = value.HasValue 
                ? (value.Value.Kind == DateTimeKind.Utc ? value : value.Value.ToUniversalTime()) 
                : (DateTime?)null;
        }

        [FirestoreProperty]
        public int CommentCount { get; set; }

        [FirestoreProperty]
        public string Visibility { get; set; }  // "public", "private", or "friends"
        
        // Array of user IDs who liked or disliked the post
        [FirestoreProperty]
        public List<string> Likes { get; set; } = new List<string>();

        [FirestoreProperty]
        public List<string> Dislikes { get; set; } = new List<string>();
    }
}
