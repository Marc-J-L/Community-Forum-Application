using backend.DTOs.Community;
using backend.DTOs.Users;
using backend.Models;
using Google.Cloud.Firestore;

namespace backend.Services
{
    public class SearchService
    {
        private readonly FirestoreDb _firestoreDb;
        private readonly CommunityService _communityService;
        private readonly UserService _userService;
        private readonly PostService _postService;

        public SearchService (FirestoreDb firestoreDb, CommunityService communityService, UserService userService, PostService postService)
        {
            _firestoreDb = firestoreDb;
            _communityService = communityService;
            _userService = userService;
            _postService = postService;
        }

        public async Task<List<CommunityWithUserInfoDto>> SearchCommunitiesAsync(string? query)
        {
            var allCommunities = await _communityService.GetPublicCommunitiesAsync();

            if (string.IsNullOrEmpty(query))
            {
                return allCommunities;
            }

            var queryText = query.ToLower();
            var results = new List<CommunityWithUserInfoDto>();

            foreach (var community in allCommunities)
            {
                if (community.Name.ToLower().Contains(queryText))
                {
                    results.Add(community);
                }
            }

            return results;
        }

        public async Task<List<UserInfoDto>> SearchUsersAsync(string? query)
        {
            {
                var allUsers = await _userService.GetAllUsersAsync();

                if (string.IsNullOrEmpty(query))
                {
                    return allUsers.Select(user => _userService.ConvertToUserInfoDto(user)).ToList();
                }

                var queryText = query.ToLower();

                var matchedUsers = allUsers
                    .Where(user =>
                        user.Email.Equals(queryText, StringComparison.OrdinalIgnoreCase) ||
                        user.FirstName.Contains(queryText, StringComparison.OrdinalIgnoreCase) || 
                        user.LastName.Contains(queryText, StringComparison.OrdinalIgnoreCase))
                    .Select(user => _userService.ConvertToUserInfoDto(user))
                    .ToList();

                return matchedUsers;
            }
        }

        public async Task<List<Post>> SearchPostsAsync(int limit, int page, string? query, string? userId)
        {
            var publicPosts = await _postService.GetPosts(limit, page);

            List<Post> friendsPosts = null;
            if (userId != null || userId != string.Empty) 
            { 
                friendsPosts = await _postService.GetFriendsAndUserPosts(userId); 
            }

            var results = publicPosts
                .Concat(friendsPosts)
                .GroupBy(post => post.PostId) 
                .Select(group => group.First())
                .OrderByDescending(r => r.CreatedAt)
                .ToList();

            if (string.IsNullOrEmpty(query))
            {
                return results;
            }

            var queryText = query.ToLower();
            var matchedTitle = new List<Post>();
            var matchedContent = new List<Post>();

            foreach (var post in results)
            {
                if (post.Title.ToLower().Contains(queryText))
                {
                    matchedTitle.Add(post);
                }
                else if (post.Text.ToLower().Contains(queryText))
                {
                    matchedContent.Add(post);
                }
            }

            return matchedTitle.Concat(matchedContent).ToList(); ;
        }
    }

    

}
