//using FirebaseAdmin.Auth;

//namespace backend.Firebase
//{
//    public class FirebaseAuthMiddleware
//    {
//        private readonly RequestDelegate _next;

//        public FirebaseAuthMiddleware(RequestDelegate next)
//        {
//            _next = next;
//        }

//        public async Task InvokeAsync(HttpContext context)
//        {
//            var authorizationHeader = context.Request.Headers["Authorization"].ToString();

//            if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
//            {
//                context.Response.StatusCode = 401; // Unauthorized
//                await context.Response.WriteAsync("Unauthorized");
//                return;
//            }

//            var token = authorizationHeader.Substring("Bearer ".Length).Trim();

//            try
//            {
//                var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);
//                context.Items["User"] = decodedToken;
//                await _next(context);
//            }
//            catch (Exception)
//            {
//                context.Response.StatusCode = 401; // Unauthorized
//                await context.Response.WriteAsync("Unauthorized");
//            }
//        }
//    }
//}