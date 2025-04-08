using backend.DTOs.Community;
using backend.Middlewares;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CommunityController : ControllerBase
    {
        private readonly CommunityService _communityService;
        private readonly FirebaseAuthService _firebaseAuthService;

        public CommunityController(CommunityService communityService, FirebaseAuthService firebaseAuthService)
        {
            _communityService = communityService;
            _firebaseAuthService = firebaseAuthService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            try
            {
                var community = await _communityService.GetCommunityAsync(id);
                if (community == null) return NotFound();
                return Ok(community);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "server_error" });
            }
        }

        [HttpPost()]
        [FirebaseAuth]
        public async Task<IActionResult> Create([FromBody] CommunityCreateDto communityCreateData)
        {
            try
            {
                var userId = _firebaseAuthService.GetUserId();

                await _communityService.CreateCommunityAsync(userId, communityCreateData);
                return Ok(new { message = "community_create_success" });
            }
            catch (Exception ex)
            {
                if (ex.Message == "community_name_exists")
                {
                    return Conflict(new { message = ex.Message });
                }

                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "server_error" });
            }
        }

        [HttpPatch("{id}")]
        [FirebaseAuth]
        public async Task<IActionResult> Update(string id, [FromBody] CommunityUpdateDto communityUpdateData)
        {
            try
            {
                await _communityService.UpdateCommunityAsync(id, communityUpdateData);
                return Ok(new { message = "community_update_success" });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "server_error" });
            }
        }
    }
}
