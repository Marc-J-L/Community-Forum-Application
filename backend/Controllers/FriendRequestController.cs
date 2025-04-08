using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using backend.Middlewares;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [FirebaseAuth]
    public class FriendRequestController : ControllerBase
    {
        private readonly FriendRequestService _friendRequestService;
        private readonly FirebaseAuthService _firebaseAuthService;

        public FriendRequestController(FriendRequestService friendRequestService, FirebaseAuthService firebaseAuthService)
        {
            _friendRequestService = friendRequestService;
            _firebaseAuthService = firebaseAuthService;
        }

        // Route: GET /FriendRequest/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<FriendRequest>> GetFriendRequestById(string id)
        {
            var friendRequest = await _friendRequestService.GetFriendRequestAsync(id);
            if (friendRequest == null) return NotFound();
            return Ok(friendRequest);
        }

        // Route: GET /FriendRequest/all
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<FriendRequest>>> GetAllFriendRequests()
        {
            var friendRequests = await _friendRequestService.GetAllFriendRequestsAsync();
            return Ok(friendRequests);
        }

        // Route: GET /FriendRequest/sent
        [HttpGet("sent")]
        public async Task<IActionResult> GetUserSentFriendRequests()
        {
            string userId = _firebaseAuthService.GetUserId();

            var friendRequests = await _friendRequestService.GetFriendRequestsBySenderIdAsync(userId);
            return Ok(friendRequests);
        }

        // Route: GET /FriendRequest/received
        [HttpGet("received")]
        public async Task<IActionResult> GetUserReceivedFriendRequests()
        {
            string userId = _firebaseAuthService.GetUserId();

            var friendRequests = await _friendRequestService.GetFriendRequestsByReceiverIdAsync(userId);
            return Ok(friendRequests);
        }

        [HttpPost("receiverId/{receiverId}")]
        public async Task<IActionResult> Post(string receiverId)
        {
            try
            {
                string senderId = _firebaseAuthService.GetUserId();

                await _friendRequestService.AddFriendRequestAsync(senderId, receiverId);

                return Ok(new { message = "friend_request_create_success" });
            }
            catch (InvalidOperationException ioex)
            {
                return BadRequest(new { message = ioex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = ex.Message });
            }

        }

        // Route: PUT /FriendRequest/cancel/{id}
        [HttpPut("cancel/{id}")]
        public async Task<ActionResult<FriendRequest>> Cancel(string id)
        {
            return await HandleFriendRequestAction("cancel", id);
        }

        // Route: PUT /FriendRequest/accept/{id}
        [HttpPut("accept/{id}")]
        public async Task<ActionResult<FriendRequest>> Accept(string id)
        {
            return await HandleFriendRequestAction("accept", id);
        }

        // Route: PUT /FriendRequest/reject/{id}
        [HttpPut("reject/{id}")]
        public async Task<ActionResult<FriendRequest>> Reject(string id)
        {
            return await HandleFriendRequestAction("reject", id);
        }

        // Route: DELETE /FriendRequest/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            string userId = _firebaseAuthService.GetUserId();

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var existingFriendRequest = await _friendRequestService.GetFriendRequestAsync(id);

            if (existingFriendRequest == null)
            {
                return NotFound("Friend request not found.");
            }

            if (existingFriendRequest.SenderId != userId)
            {
                return Unauthorized("Only the sender can delete the friend request.");
            }

            await _friendRequestService.DeleteFriendRequestAsync(id);
            return NoContent();
        }

        private async Task<ActionResult<FriendRequest>> HandleFriendRequestAction(string action, string id)
        {
            string userId = _firebaseAuthService.GetUserId();

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var existingFriendRequest = await _friendRequestService.GetFriendRequestAsync(id);

            if (existingFriendRequest == null)
            {
                return NotFound("Friend request not found.");
            }

            switch (action.ToLower())
            {
                case "cancel":
                    if (existingFriendRequest.SenderId != userId)
                    {
                        return Unauthorized("Only the sender can cancel the friend request.");
                    }
                    existingFriendRequest.Status = "Canceled";
                    break;

                case "accept":
                    if (existingFriendRequest.ReceiverId != userId)
                    {
                        return Unauthorized("Only the receiver can accept the friend request.");
                    }
                    existingFriendRequest.Status = "Accepted";
                    break;

                case "reject":
                    if (existingFriendRequest.ReceiverId != userId)
                    {
                        return Unauthorized("Only the receiver can reject the friend request.");
                    }
                    existingFriendRequest.Status = "Rejected";
                    break;

                default:
                    return BadRequest("Invalid action.");
            }

            await _friendRequestService.UpdateFriendRequestAsync(id, existingFriendRequest);
            return Ok(existingFriendRequest);
        }
    }
}
