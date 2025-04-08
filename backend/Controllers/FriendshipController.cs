using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using backend.Middlewares;
using backend.DTOs.UserCommunity;
using backend.DTOs.Friendship;


namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [FirebaseAuth]
    public class FriendshipController : ControllerBase
    {
        private readonly FriendshipService _friendshipService;
        private readonly FirebaseAuthService _firebaseAuthService;

        public FriendshipController(FriendshipService friendshipService, FirebaseAuthService firebaseAuthService)
        {
            _friendshipService = friendshipService;
            _firebaseAuthService = firebaseAuthService;
        }

        [HttpGet()]
        public async Task<IActionResult> Get()
        {
            var userId = _firebaseAuthService.GetUserId();

            var friendships = await _friendshipService.GetFriendshipsAsync(userId);
            if (friendships == null) return NotFound();
            return Ok(friendships);
        }

        [HttpGet("friendId/{friendId}")]
        public async Task<IActionResult> Get(string friendId)
        {
            var userId = _firebaseAuthService.GetUserId();

            var friendship = await _friendshipService.GetFriendshipAsync(userId, friendId);
            if (friendship == null) return NotFound();
            return Ok(friendship);
        }

        [HttpPatch("friendId/{friendId}")]
        public async Task<IActionResult> ToggleIsCloseFriend(string friendId, [FromBody] FriendshipUpdateDto updateData)
        {
            try
            {
                var userId = _firebaseAuthService.GetUserId();

                bool isCloseFriend = updateData.IsCloseFriend;
                await _friendshipService.UpdateIsCloseFriendAsync(userId, friendId, isCloseFriend);
                return Ok(new { message = isCloseFriend ? "add_close_friend_success" : "remove_colse_friend_success" });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "server_error" });
            }
        }

        [HttpDelete("friendId/{friendId}")]
        public async Task<IActionResult> Delete(string friendId)
        {
            try
            {
                var userId = _firebaseAuthService.GetUserId();
                await _friendshipService.RemoveFriendAsync(userId, friendId);
                return Ok();
            } 
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "server_error" });
            }

        }
    }
}
