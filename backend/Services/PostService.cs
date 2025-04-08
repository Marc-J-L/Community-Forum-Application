using backend.DTOs.Posts;
using backend.DTOs.Users;
using backend.Models;
using Google.Cloud.Firestore;
using Google.Type;

namespace backend.Services
{
    public class PostService
    {
        private readonly FirestoreDb _firestoreDb;
        private readonly UserService _userService;

        public PostService(FirestoreDb firestoreDb, UserService userService)
        {
            _firestoreDb = firestoreDb;
            _userService = userService;
        }

        // public async Task<List<PostWithUserInfoDto>> GetAllPostsAsync()
        // {
        //     var postsResponse = new List<PostWithUserInfoDto>();
        //     var query = _firestoreDb.Collection("posts");
        //     var querySnapshot = await query.GetSnapshotAsync();

        //     foreach (var documentSnapshot in querySnapshot.Documents)
        //     {
        //         var post = documentSnapshot.ConvertTo<Post>();
        //         var user = await _userService.GetUserAsync(post.authorId);

        //         postsResponse.Add(new PostWithUserInfoDto
        //         {
        //             Id = post.postId,
        //             Title = post.title,
        //             Content = post.text,
        //             // CreatedAt = post.createdAt.ToDate(),
        //             Author = new UserInfoDto
        //             {
        //                 Id = user.Id,
        //                 FirstName = user.FirstName,
        //                 LastName = user.LastName,
        //                 Bio = user.Bio,
        //                 ProfileImageUrl = user.ProfileImageUrl,
        //                 Role = user.Role,
        //                 CreatedAt = user.CreatedAt,
        //             }
        //         });
        //     }

        //     return postsResponse;
        // }

        public async Task<List<Post>> GetPostsByUser(string userId, string? currentUserId)
        {
            CollectionReference postsRef = _firestoreDb.Collection("posts");

            Query query = postsRef
                .WhereEqualTo("AuthorId", userId);


            QuerySnapshot snapshot = await query.GetSnapshotAsync();
            List<Post> posts = new List<Post>();

            bool isFriend = false;
            if (!string.IsNullOrEmpty(currentUserId))
            {
                var friendshipRef = _firestoreDb.Collection("friendships").Document($"{currentUserId}_{userId}");
                var friendship = await friendshipRef.GetSnapshotAsync();
                isFriend = friendship.Exists;
            }

            foreach (DocumentSnapshot document in snapshot.Documents)
            {
                if (document.Exists)
                {
                    Post post = document.ConvertTo<Post>();

                    if (post.Visibility.Equals("public"))
                    {
                        posts.Add(post);
                    }
                    else if (post.Visibility.Equals("private") && isFriend)
                    {
                        posts.Add(post); 
                    }
                }
            }

            return posts.OrderByDescending(p => p.CreatedAt).ToList();
        }

        public async Task<List<Post>> GetPostsByCommunity(string communityId, string? currentUserId)
        {
            CollectionReference postsRef = _firestoreDb.Collection("posts");

            Query query = postsRef
                .WhereEqualTo("CommunityId", communityId);


            QuerySnapshot snapshot = await query.GetSnapshotAsync();
            List<Post> posts = new List<Post>();

            bool isFriend = false;
            if (!string.IsNullOrEmpty(currentUserId))
            {
                var friendshipRef = _firestoreDb.Collection("friendships").Document($"{currentUserId}_{communityId}");
                var friendship = await friendshipRef.GetSnapshotAsync();
                isFriend = friendship.Exists;
            }

            foreach (DocumentSnapshot document in snapshot.Documents)
            {
                if (document.Exists)
                {
                    Post post = document.ConvertTo<Post>();

                    if (post.Visibility.Equals("public"))
                    {
                        posts.Add(post);
                    }
                    else if (post.Visibility.Equals("private") && isFriend)
                    {
                        posts.Add(post);
                    }
                }
            }

            return posts.OrderByDescending(p => p.CreatedAt).ToList();
        }

        public async Task<List<Post>> GetPosts(int limit, int page = 1)
        {
            CollectionReference postsRef = _firestoreDb.Collection("posts");
            Query query = postsRef.OrderByDescending("CreatedAt").Limit(limit);

            // Calculate the number of posts to skip based on the page number
            int skipCount = (page - 1) * limit;

            // Fetch all posts, and then skip the required number for pagination
            QuerySnapshot snapshot = await query.GetSnapshotAsync();
            List<Post> posts = new List<Post>();

            foreach (DocumentSnapshot document in snapshot.Documents)
            {
                if (document.Exists)
                {
                    Post post = document.ConvertTo<Post>();
                    if (post.Visibility == "public")
                    {
                        posts.Add(post);
                    }

                }
            }

            // Skip the required number of posts for pagination
            return posts.OrderByDescending(p => p.CreatedAt).Skip(skipCount).Take(limit).ToList();
        }
        public async Task<List<Post>> GetOnlyMePostsByUser(string userId)
        {
            CollectionReference postsRef = _firestoreDb.Collection("posts");

            // Query to fetch posts with visibility "Only Me" and filter by authorId
            Query query = postsRef
                .WhereEqualTo("Visibility", "only-me")
                .WhereEqualTo("AuthorId", userId);


            QuerySnapshot snapshot = await query.GetSnapshotAsync();
            List<Post> posts = new List<Post>();

            foreach (DocumentSnapshot document in snapshot.Documents)
            {
                if (document.Exists)
                {
                    Post post = document.ConvertTo<Post>();
                    posts.Add(post);
                }
            }

            // Skip the required number of posts for pagination
            return posts.OrderByDescending(p => p.CreatedAt).ToList();
        }

        public async Task<List<Post>> GetFriendsAndUserPosts(string userId)
        {
            // Step 1: Fetch all friendship documents where the document ID is the userId
            CollectionReference friendshipsRef = _firestoreDb.Collection("friendships");
            Query friendshipQuery = friendshipsRef.WhereEqualTo("UserId", userId);
            QuerySnapshot friendshipSnapshot = await friendshipQuery.GetSnapshotAsync();

            List<string> friendIds = new List<string>();

            // Collect friend IDs from friendship documents
            foreach (DocumentSnapshot friendshipDoc in friendshipSnapshot.Documents)
            {
                if (friendshipDoc.Exists)
                {
                    // Assuming the friendship document contains a field "FriendId" that stores the friend's user ID
                    string friendId = friendshipDoc.GetValue<string>("FriendId");
                    friendIds.Add(friendId);
                }
            }

            // Step 2: Fetch all posts where Visibility is not "only-me"
            CollectionReference postsRef = _firestoreDb.Collection("posts");
            Query postQuery = postsRef.WhereNotEqualTo("Visibility", "only-me");
            QuerySnapshot postSnapshot = await postQuery.GetSnapshotAsync();

            List<Post> combinedPosts = new List<Post>();

            // Step 3: Check each post's visibility and author ID
            foreach (DocumentSnapshot postDoc in postSnapshot.Documents)
            {
                if (postDoc.Exists)
                {
                    Post post = postDoc.ConvertTo<Post>();

                    // Check if the post's AuthorId is in the friendIds list or if it matches the userId
                    if (friendIds.Contains(post.AuthorId) || post.AuthorId == userId)
                    {
                        combinedPosts.Add(post);
                    }
                }
            }

            return combinedPosts.OrderByDescending(p => p.CreatedAt).ToList();
        }




        public async Task CreatePost(Post post)
        {
            post.PostId = Guid.NewGuid().ToString();
            post.CreatedAt = System.DateTime.UtcNow;
            post.UpdatedAt = System.DateTime.UtcNow;

            DocumentReference docRef = _firestoreDb.Collection("posts").Document(post.PostId);
            await docRef.SetAsync(post);
        }

        public async Task DeletePost(string postId)
        {
            DocumentReference docRef = _firestoreDb.Collection("posts").Document(postId);
            await docRef.DeleteAsync();
        }

        public async Task<bool> EditPostAsync(string postId, string title, string text, string[]? images, string visiblity)
        {
            var postRef = _firestoreDb.Collection("posts").Document(postId);

            var postData = new
            {
                Title = title,
                Text = text,
                Images = images ?? [], // Use an empty array if no images are provided
                Visibility = visiblity
            };

            try
            {
                await postRef.SetAsync(postData, SetOptions.MergeAll);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating post: {ex.Message}");
                return false;
            }
        }

        public async Task<Post> GetPostDetailsAsync(string postId)
        {
            var docRef = _firestoreDb.Collection("posts").Document(postId);
            var snapshot = await docRef.GetSnapshotAsync();

            if (snapshot.Exists)
            {
                return snapshot.ConvertTo<Post>();
            }

            return null;
        }


        public async Task<List<Post>> GetPostsByDate(System.DateTime selectedDate) // Specify System.DateTime here
        {
            CollectionReference postsRef = _firestoreDb.Collection("posts");

            // Set the range for the selected day (start and end of the day)
            var startOfDay = Timestamp.FromDateTime(selectedDate.Date.ToUniversalTime());
            var endOfDay = Timestamp.FromDateTime(selectedDate.Date.AddDays(1).ToUniversalTime());

            // Query posts that were created between the start and end of the selected day
            Query query = postsRef
                .WhereGreaterThanOrEqualTo("CreatedAt", startOfDay)
                .WhereLessThan("CreatedAt", endOfDay);

            QuerySnapshot snapshot = await query.GetSnapshotAsync();
            List<Post> posts = new List<Post>();

            foreach (DocumentSnapshot document in snapshot.Documents)
            {
                if (document.Exists)
                {
                    Post post = document.ConvertTo<Post>();
                    posts.Add(post);
                }
            }

            return posts.OrderByDescending(p => p.CreatedAt).ToList();
        }

        //public async Task<Dictionary<string, int>> GetPostCountsLastFiveDaysAsync()
        //{
        //    var today = System.DateTime.UtcNow.Date;
        //    var fiveDaysAgo = today.AddDays(-5);

        //    // 
        //    var startTimestamp = Timestamp.FromDateTime(fiveDaysAgo.ToUniversalTime());
        //    var endTimestamp = Timestamp.FromDateTime(today.AddDays(1).ToUniversalTime());

        //    // 
        //    var query = _firestoreDb.Collection("posts")
        //        .WhereGreaterThanOrEqualTo("CreatedAt", startTimestamp)
        //        .WhereLessThan("CreatedAt", endTimestamp);

        //    var snapshot = await query.GetSnapshotAsync();

        //    // 
        //    var postCounts = new Dictionary<string, int>();

        //    // 
        //    for (var date = fiveDaysAgo; date <= today; date = date.AddDays(1))
        //    {
        //        postCounts[date.ToString("yyyy-MM-dd")] = 0; 
        //    }

        //    // 
        //    foreach (var document in snapshot.Documents)
        //    {
        //        if (document.Exists && document.ContainsField("CreatedAt"))
        //        {
        //            // 
        //            var timestamp = document.GetValue<Timestamp>("CreatedAt");

        //            // 
        //            var createdAtDate = timestamp.ToDateTime().Date;

        //            // 
        //            var dateKey = createdAtDate.ToString("yyyy-MM-dd");

        //            // 
        //            if (postCounts.ContainsKey(dateKey))
        //            {
        //                postCounts[dateKey]++;
        //            }
        //        }
        //    }
        //    return postCounts; 
        //}

        public async Task<Dictionary<string, int>> GetPostCountsLastFiveDaysAsync()
        {
            TimeZoneInfo easternTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");


            var today = TimeZoneInfo.ConvertTimeFromUtc(System.DateTime.UtcNow, easternTimeZone).Date;
            var fiveDaysAgo = today.AddDays(-5);

          
            var postCounts = new Dictionary<string, int>();

            // 
            for (var date = fiveDaysAgo; date <= today; date = date.AddDays(1))
            {
                // one day time
                var startTimestamp = Timestamp.FromDateTime(date.ToUniversalTime());
                var endTimestamp = Timestamp.FromDateTime(date.AddDays(1).ToUniversalTime());

                // search from one day
                var query = _firestoreDb.Collection("posts")
                    .WhereGreaterThanOrEqualTo("CreatedAt", startTimestamp)
                    .WhereLessThan("CreatedAt", endTimestamp);

                var snapshot = await query.GetSnapshotAsync();

                // count post number
                postCounts[date.ToString("yyyy-MM-dd")] = snapshot.Documents.Count(document => document.Exists);
            }


            return postCounts;
        }


        // Add Like
        public async Task AddLikeAsync(string postId, string userId)
        {
            DocumentReference postRef = _firestoreDb.Collection("posts").Document(postId);
            DocumentSnapshot snapshot = await postRef.GetSnapshotAsync();

            if (snapshot.Exists)
            {
                Post post = snapshot.ConvertTo<Post>();

                if (!post.Likes.Contains(userId))
                {
                    post.Likes.Add(userId);
                    if (post.Dislikes.Contains(userId)) post.Dislikes.Remove(userId); // Ensure no simultaneous dislike
                }

                await postRef.SetAsync(post, SetOptions.MergeAll);
            }
        }

        // Remove Like
        public async Task RemoveLikeAsync(string postId, string userId)
        {
            DocumentReference postRef = _firestoreDb.Collection("posts").Document(postId);
            DocumentSnapshot snapshot = await postRef.GetSnapshotAsync();

            if (snapshot.Exists)
            {
                Post post = snapshot.ConvertTo<Post>();

                if (post.Likes.Contains(userId))
                {
                    post.Likes.Remove(userId);
                }

                await postRef.SetAsync(post, SetOptions.MergeAll);
            }
        }

        // Add Dislike
        public async Task AddDislikeAsync(string postId, string userId)
        {
            DocumentReference postRef = _firestoreDb.Collection("posts").Document(postId);
            DocumentSnapshot snapshot = await postRef.GetSnapshotAsync();

            if (snapshot.Exists)
            {
                Post post = snapshot.ConvertTo<Post>();

                if (!post.Dislikes.Contains(userId))
                {
                    post.Dislikes.Add(userId);
                    if (post.Likes.Contains(userId)) post.Likes.Remove(userId); // Ensure no simultaneous like
                }

                await postRef.SetAsync(post, SetOptions.MergeAll);
            }
        }

        // Remove Dislike
        public async Task RemoveDislikeAsync(string postId, string userId)
        {
            DocumentReference postRef = _firestoreDb.Collection("posts").Document(postId);
            DocumentSnapshot snapshot = await postRef.GetSnapshotAsync();

            if (snapshot.Exists)
            {
                Post post = snapshot.ConvertTo<Post>();

                if (post.Dislikes.Contains(userId))
                {
                    post.Dislikes.Remove(userId);
                }

                await postRef.SetAsync(post, SetOptions.MergeAll);
            }
        }



    }
}
