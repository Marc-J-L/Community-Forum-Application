using Google.Cloud.Firestore;

namespace backend.DTOs.Users
{
    public class UserUpdateDto
    {
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? DOB { get; set; }  // Allow updating the Date of Birth

        public string? Gender { get; set; }

        public string? Bio { get; set; }

        public string? ProfileImageUrl { get; set; }

        public string? Role { get; set; }  // Allow changing the user's role
    }
}