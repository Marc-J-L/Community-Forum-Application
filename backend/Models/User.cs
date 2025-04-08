using Google.Cloud.Firestore;

namespace backend.Models
{
    [FirestoreData]
    public class User
    {
        [FirestoreDocumentId]
        public string Id { get; set; }               // Unique ID for the user

        [FirestoreProperty]
        public string FirstName { get; set; }        // User's First Name

        [FirestoreProperty]
        public string LastName { get; set; }         // User's Last Name

        [FirestoreProperty]
        public string DOB { get; set; }            // User's Date of Birth

        [FirestoreProperty]
        public string Gender { get; set; }           // User's Gender

         [FirestoreProperty("Bio")]
    public string? Bio { get; set; }             // Optional biography

         [FirestoreProperty("ProfileImageUrl")]
    public string? ProfileImageUrl { get; set; } // Optional profile image

        [FirestoreProperty]
        public string Role { get; set; }             // Role of the user (Admin, User)

        [FirestoreProperty("CreatedAt")]
    public Timestamp CreatedAt { get; set; }     // Timestamp when user was created
[
    
    FirestoreProperty("Email")]
    public string? Email { get; set; }            // User's email for Firebase Auth (not stored in Firestore)
        public string? Password { get; set; }         // User's password for Firebase Auth (not stored in Firestore)
    }
}