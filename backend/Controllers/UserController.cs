// // Controllers/UsersController.cs
// using Microsoft.AspNetCore.Mvc;
// using backend.Models;
// using backend.Services;
//
//
// namespace backend.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class UsersController : ControllerBase
//     {
//         private readonly UserService _userService;
//
//         public UsersController(UserService userService)
//         {
//             _userService = userService;
//         }
//
//         [HttpGet("{id}")]
//         public async Task<ActionResult<User>> Get(string id)
//         {
//             var user = await _userService.GetUserAsync(id);
//             if (user == null) return NotFound();
//             return Ok(user);
//         }
//
//         [HttpGet]
//         public async Task<ActionResult<IEnumerable<User>>> Get()
//         {
//             var users = await _userService.GetAllUsersAsync();
//             return Ok(users);
//         }
//
//         [HttpPost]
//         public async Task<ActionResult<User>> Post([FromBody] User user)
//         {
//             await _userService.AddUserAsync(user);
//             return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
//         }
//
//         [HttpPut("{id}")]
//         public async Task<ActionResult<User>> Put(string id, [FromBody] User updatedUser)
//         {
//             await _userService.UpdateUserAsync(id, updatedUser);
//             return Ok(updatedUser);
//         }
//
//         [HttpDelete("{id}")]
//         public async Task<ActionResult> Delete(string id)
//         {
//             await _userService.DeleteUserAsync(id);
//             return NoContent();
//         }
//     }
// }


using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using FirebaseAdmin.Auth;
using Google.Cloud.Firestore;
 using backend.Middlewares;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(string id)
        {
            var user = await _userService.GetUserAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> Get()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpPost]
         [FirebaseAuth]
        public async Task<ActionResult<User>> Post([FromBody] User user)
        {
            try
            {
                // Create a new Firebase Authentication user
                var firebaseUser = await FirebaseAuth.DefaultInstance.CreateUserAsync(new UserRecordArgs
                {
                    Email = user.Email,
                    Password = user.Password,
                    DisplayName = $"{user.FirstName} {user.LastName}"
                });

                // Set Firebase User ID as the Firestore document ID
                user.Id = firebaseUser.Uid;
                user.CreatedAt = Timestamp.FromDateTime(DateTime.UtcNow);

                // Save the user's profile in Firestore
                await _userService.AddUserAsync(user);

                return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        // [FirebaseAuth]
        public async Task<ActionResult<User>> Put(string id, [FromBody] User updatedUser)
        {
            await _userService.UpdateUserAsync(id, updatedUser);
            return Ok(updatedUser);
        }

        [HttpDelete("{id}")]
         [FirebaseAuth]
        public async Task<ActionResult> Delete(string id)
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }
    }
}
