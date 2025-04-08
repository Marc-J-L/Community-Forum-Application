using Google.Cloud.Firestore;

namespace backend.DTOs.Users
{
    public class UserInfoDto
    {
        public string Id { get; set; }
       
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string DOB { get; set; }

        public string Gender { get; set; }

        public string Bio { get; set; } 

        public string? ProfileImageUrl { get; set; } 

        public string Role { get; set; }   

        public Timestamp CreatedAt { get; set; } 
        public string Email { get; set; }
    }
}
