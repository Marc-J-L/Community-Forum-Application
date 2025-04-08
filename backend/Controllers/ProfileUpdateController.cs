// Controllers/ProfileUpdateController.cs

using Microsoft.AspNetCore.Mvc;
using backend.Services;
using FirebaseAdmin.Auth;
using backend.Middlewares;
using backend.DTOs.Users;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProfileUpdateController : ControllerBase
    {
        private readonly ProfileUpdateService _profileUpdateService;

        public ProfileUpdateController(ProfileUpdateService profileUpdateService)
        {
            _profileUpdateService = profileUpdateService;
        }

        // Get the current user's profile using their token
        [HttpGet]
        [FirebaseAuth]
        public async Task<ActionResult<UserInfoDto>> GetProfile()
        {
            var firebaseToken = HttpContext.Items["User"] as FirebaseToken;
            if (firebaseToken == null) return Unauthorized();

            Console.WriteLine("GetProfile called. UID: " + firebaseToken.Uid);

            try
            {
                var userProfile = await _profileUpdateService.GetUserProfileAsync(firebaseToken.Uid);
                if (userProfile == null) return NotFound();
                return Ok(userProfile);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception in GetProfile: " + ex.ToString());
                return StatusCode(500, "An error occurred while fetching the profile.");
            }
        }

        // Update the current user's profile using their token
        [HttpPut]
         [FirebaseAuth]
        public async Task<ActionResult<UserUpdateDto>> UpdateProfile([FromBody] UserUpdateDto updatedProfile)
        {
            var firebaseToken = HttpContext.Items["User"] as FirebaseToken;
            if (firebaseToken == null) return Unauthorized();

            Console.WriteLine("UpdateProfile called. UID: " + firebaseToken.Uid);

            try
            {
                await _profileUpdateService.UpdateUserProfileAsync(firebaseToken.Uid, updatedProfile);
                return Ok(updatedProfile);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception in UpdateProfile: " + ex.ToString());
                return StatusCode(500, "An error occurred while updating the profile.");
            }
        }
    }
}
