// Middlewares/FirebaseAuthAttribute.cs

using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace backend.Middlewares
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public class FirebaseAuthAttribute : Attribute, IAsyncAuthorizationFilter
    {
        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var authorizationHeader = context.HttpContext.Request.Headers["Authorization"].ToString();

            Console.WriteLine("Authorization Header: " + authorizationHeader);

            if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var token = authorizationHeader.Substring("Bearer ".Length).Trim();

            try
            {
                var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);
                context.HttpContext.Items["User"] = decodedToken;
                Console.WriteLine("Token verified. UID: " + decodedToken.Uid);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception in FirebaseAuthAttribute: " + ex.ToString());
                context.Result = new UnauthorizedResult();
            }
        }
    }
}
