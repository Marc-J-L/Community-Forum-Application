using Microsoft.AspNetCore.Mvc;
using FirebaseAdmin.Auth;
using backend.Services;
using backend.Middlewares;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [FirebaseAuth]
    public class UserBlockController : ControllerBase
    {
        private readonly UserBlockService _userBlockService;
        private readonly FirebaseAuthService _firebaseAuthService;

        public UserBlockController(UserBlockService userBlockService, FirebaseAuthService firebaseAuthService)
        {
            _userBlockService = userBlockService;
            _firebaseAuthService = firebaseAuthService;
        }

        // Route: POST /UserBlock/block/{blockedUserId}
        [HttpPost("block/{blockedUserId}")]
        public async Task<IActionResult> BlockUser(string blockedUserId)
        {
            try
            {
                string blockingUserId = _firebaseAuthService.GetUserId();

                // Check if blockingUserId is null and throw an exception if it is
                if (string.IsNullOrEmpty(blockingUserId))
                {
                    throw new InvalidOperationException("Blocking user ID cannot be null or empty.");
                }

                await _userBlockService.BlockUserAsync(blockingUserId, blockedUserId);
                return Ok(new { message = "User blocked successfully!" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        // Route: DELETE /UserBlock/unblock/{blockedUserId}
        [HttpDelete("unblock/{blockedUserId}")]
        public async Task<IActionResult> UnblockUser(string blockedUserId)
        {
            try
            {
                string blockingUserId = _firebaseAuthService.GetUserId();
                await _userBlockService.UnblockUserAsync(blockingUserId, blockedUserId);
                return Ok(new { message = "user_unblocked_successfully" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Route: GET /UserBlock/user/
        [HttpGet("user")]
        public async Task<IActionResult> GetBlocksForUser()
        {
            string userId = _firebaseAuthService.GetUserId();
            var blocks = await _userBlockService.GetBlocksByUserIdAsync(userId);
            return Ok(blocks);
        }

    }
}
