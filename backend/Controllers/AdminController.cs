using backend.Services;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;
using backend.Middlewares;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _adminService;

        public AdminController(AdminService adminService)
        {
            _adminService = adminService;
        }

        // Suspend a user
        [HttpPut("suspend/{uid}")]
        [FirebaseAuth]
        public async Task<ActionResult> SuspendUser(string uid)
        {
            var firebaseToken = HttpContext.Items["User"] as FirebaseToken;
            if (firebaseToken == null || firebaseToken.Claims["role"].ToString() != "Admin")
                return Unauthorized("Only admins can suspend users.");

            await _adminService.SuspendUserAsync(uid);
            return Ok("User has been suspended.");
        }

        // Promote a user to admin
        [HttpPut("promote/{uid}")]
        [FirebaseAuth]
        public async Task<ActionResult> PromoteToAdmin(string uid)
        {
            var firebaseToken = HttpContext.Items["User"] as FirebaseToken;
            if (firebaseToken == null || firebaseToken.Claims["Role"].ToString() != "Admin")
                return Unauthorized("Only admins can promote users to admin.");

            await _adminService.PromoteToAdminAsync(uid);
            return Ok("User has been promoted to admin.");
        }


        // Demote a user to a regular user
[HttpPut("demote/{uid}")]
[FirebaseAuth]
public async Task<ActionResult> DemoteToUser(string uid)
{
    var firebaseToken = HttpContext.Items["User"] as FirebaseToken;
    if (firebaseToken == null || firebaseToken.Claims["Role"].ToString() != "Admin")
        return Unauthorized("Only admins can demote users.");

    await _adminService.DemoteToUserAsync(uid);
    return Ok("User has been demoted to regular user.");
}

    }
}
