using backend.DTOs.UserCommunity;
using backend.Middlewares;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [FirebaseAuth]
    public class UserCommunityController : ControllerBase
    {
        private readonly UserCommunityService _userCommunityService;
        private readonly FirebaseAuthService _firebaseAuthService;

        public UserCommunityController(UserCommunityService userCommunityService, FirebaseAuthService firebaseAuthService)
        {
            _userCommunityService = userCommunityService;
            _firebaseAuthService = firebaseAuthService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> Get()
        {
            var userId = _firebaseAuthService.GetUserId();

            var communities = await _userCommunityService.GetUserCommunitiesAsync(userId);
            return Ok(communities); 
        }

        [HttpGet("joined")]
        public async Task<IActionResult> GetJoined()
        {
            var userId = _firebaseAuthService.GetUserId();

            var communities = await _userCommunityService.GetUserCommunitiesAsync(userId, false);
            return Ok(communities);
        }

        [HttpGet("owned")]
        public async Task<IActionResult> GetOwned()
        {
            var userId = _firebaseAuthService.GetUserId();

            var communities = await _userCommunityService.GetUserCommunitiesAsync(userId, true);
            return Ok(communities);
        }

        [HttpPost("communityId/{communityId}")]
        public async Task<IActionResult> Join(string communityId)
        {
            try
            {
                var userId = _firebaseAuthService.GetUserId();

                var joinedCommunity = await _userCommunityService.JoinCommunityAsync(userId, communityId);
                return Ok(joinedCommunity);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "server_error" });
            }
        }

        [HttpDelete("communityId/{communityId}")]
        public async Task<IActionResult> Leave(string communityId)
        {
            try
            {
                var userId = _firebaseAuthService.GetUserId();

                await _userCommunityService.LeaveCommunityAsync(userId, communityId);
                return Ok(new { message = "leave_community_success" });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "server_error" });
            }
        }

        [HttpPatch("communityId/{communityId}")]
        public async Task<IActionResult> ToggleIsStarred(string communityId, [FromBody] UserCommunityUpdateDto updateData)
        {
            try
            {
                var userId = _firebaseAuthService.GetUserId();

                bool isStarred = updateData.IsStarred;
                await _userCommunityService.UpdateIsStarredAsync(userId, communityId, isStarred);
                return Ok(new { message = isStarred ? "starred_community_success" : "unStarred_community_success" });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "server_error" });
            }
        }
    }
}
