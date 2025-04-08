using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PostController : ControllerBase
    {
        private readonly PostService _postService;

        public PostController(PostService postService)
        {
            _postService = postService;
        }

        [HttpGet()]
        public async Task<IActionResult> GetPosts([FromQuery] int limit = 5, [FromQuery] int page = 1)
        {
            try
            {
                var posts = await _postService.GetPosts(limit, page);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                // Handle error
                return StatusCode(500, $"Error fetching posts: {ex.Message}");
            }
        }
        [HttpGet("userId/{userId}")]
        public async Task<IActionResult> GetPostsByUser(string userId, [FromQuery] string? currentUserId)
        {
            try
            {
                List<Post> posts = await _postService.GetPostsByUser(userId, currentUserId);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("communityId/{communityId}")]
        public async Task<IActionResult> GetPostsByCommunity(string communityId, [FromQuery] string? currentUserId)
        {
            try
            {
                List<Post> posts = await _postService.GetPostsByCommunity(communityId, currentUserId);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("only-me")]
        public async Task<IActionResult> GetOnlyMePosts([FromQuery] string userId)
        {
            try
            {
                // Call the service method to get posts with visibility "Only Me" by user
                List<Post> posts = await _postService.GetOnlyMePostsByUser(userId);

                // Return the posts as a JSON response
                return Ok(posts);
            }
            catch (Exception ex)
            {
                // Handle exceptions
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("private")]
        public async Task<IActionResult> GetPrivatePostsFromFriends([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is required.");
            }

            try
            {
                List<Post> posts = await _postService.GetFriendsAndUserPosts(userId);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("create")]
        public async Task<ActionResult> CreatePost([FromBody] Post post)
        {
            await _postService.CreatePost(post);
            return Ok();
        }

        [HttpDelete("delete/{postId}")]
        public async Task<ActionResult> DeletePost(string postId)
        {
            await _postService.DeletePost(postId);
            return Ok();
        }


        [HttpPut("{postId}")]
        public async Task<IActionResult> EditPost(string postId, [FromBody] EditPostRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Title) || string.IsNullOrEmpty(request.Text)|| string.IsNullOrEmpty(request.Visibility))
            {
                return BadRequest("Invalid post data.");
            }
            string[] postImages = request.Images ?? Array.Empty<string>();

            bool result = await _postService.EditPostAsync(postId, request.Title, request.Text, postImages, request.Visibility);

            if (result)
            {
                return NoContent(); // 204 No Content
            }

            return StatusCode(500, "An error occurred while updating the post.");
        }

        [HttpGet("{postId}")]
        public async Task<IActionResult> GetPostDetails(string postId)
        {
            if (string.IsNullOrEmpty(postId))
            {
                return BadRequest("Post ID is required.");
            }

            var post = await _postService.GetPostDetailsAsync(postId);

            if (post == null)
            {
                return NotFound($"Post with ID {postId} was not found.");
            }

            return Ok(post);
        }

        [HttpGet("by-date")]
        public async Task<IActionResult> GetPostsByDate([FromQuery] System.DateTime date)  // Use System.DateTime explicitly
        {
            try
            {
                var posts = await _postService.GetPostsByDate(date);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching posts: {ex.Message}");
            }
        }

        // Create a new class to represent the post count data
        //public class PostCount
        //{
        //    public string Date { get; set; }
        //    public int Count { get; set; }
        //}


        // GET api/posts/counts/last-5-days
        [HttpGet("counts/last-5-days")]
        public async Task<ActionResult<Dictionary<string, int>>> GetPostCountsLastFiveDays()
        {
            try
            {
                // 
                var postCountsDict = await _postService.GetPostCountsLastFiveDaysAsync();

                // 
                return Ok(postCountsDict);
            }
            catch (Exception ex)
            {
                // 
                return StatusCode(500, "An error occurred while fetching post counts.");
            }
        }

       


        // Add Like
        [HttpPost("like")]
        public async Task<IActionResult> AddLike([FromQuery] string postId, [FromQuery] string userId)
        {
            await _postService.AddLikeAsync(postId, userId);
            return Ok();
        }

        // Remove Like
        [HttpDelete("like")]
        public async Task<IActionResult> RemoveLike([FromQuery] string postId, [FromQuery] string userId)
        {
            await _postService.RemoveLikeAsync(postId, userId);
            return Ok();
        }

        // Add Dislike
        [HttpPost("dislike")]
        public async Task<IActionResult> AddDislike([FromQuery] string postId, [FromQuery] string userId)
        {
            await _postService.AddDislikeAsync(postId, userId);
            return Ok();
        }

        // Remove Dislike
        [HttpDelete("dislike")]
        public async Task<IActionResult> RemoveDislike([FromQuery] string postId, [FromQuery] string userId)
        {
            await _postService.RemoveDislikeAsync(postId, userId);
            return Ok();
        }

    }
}
