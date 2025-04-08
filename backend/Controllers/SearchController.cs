using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly SearchService _searchService;

        public SearchController (SearchService searchService)
        {
            _searchService = searchService;
        }

        [HttpGet("communities")]
        public async Task<IActionResult> Search([FromQuery] string? q)
        {
            try
            {
                var communities = await _searchService.SearchCommunitiesAsync(q);
                return Ok(communities);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("users")]
        public async Task<IActionResult> SearchUsers([FromQuery] string? q)
        {
            try
            {
                var users = await _searchService.SearchUsersAsync(q);
                return Ok(users);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("posts")]
        public async Task<IActionResult> SearchPosts([FromQuery] string? userId, [FromQuery] string? q, [FromQuery] int limit = 5, [FromQuery] int page = 1)
        {
            try
            {
                var posts = await _searchService.SearchPostsAsync(limit, page, q, userId);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
