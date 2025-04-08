using FirebaseAdmin.Auth;

namespace backend.Services
{
    public class FirebaseAuthService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public FirebaseAuthService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetUserId()
        {
            var firebaseToken = _httpContextAccessor.HttpContext?.Items["User"] as FirebaseToken;
            return firebaseToken?.Uid;
        }
    }
}
