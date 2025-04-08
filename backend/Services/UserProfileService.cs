using Google.Cloud.Firestore;
using backend.Models;
using backend.DTOs.Users;
using FirebaseAdmin.Auth;

namespace backend.Services
{
    public class UserProfileService
    {
        private readonly FirestoreDb _firestoreDb;

        public UserProfileService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // Fetch user profile data by ID
        public async Task<UserInfoDto?> GetUserProfileAsync(string userId)
        {
            DocumentReference docRef = _firestoreDb.Collection("users").Document(userId);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists)
            {
                return null;
            }

            var user = snapshot.ConvertTo<User>();

            // Fetch email from Firebase Authentication
            var firebaseUser = await FirebaseAuth.DefaultInstance.GetUserAsync(userId);

            return new UserInfoDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DOB = user.DOB,
                Gender = user.Gender,
                Bio = user.Bio,
                ProfileImageUrl = user.ProfileImageUrl ?? GetDefaultProfileImage(user.Gender),  // Default image if none provided
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                Email = firebaseUser.Email // Get email from FirebaseAuth
            };
        }

        // Helper method to get default profile image based on gender
        private string GetDefaultProfileImage(string gender)
        {
            return gender.ToLower() switch
            {
                "male" => "/images/profiles/male.webp",
                "female" => "/images/profiles/female.webp",
                "non-binary" => "/images/profiles/nonbinary.webp",
                _ => "/images/profiles/unknown.webp"
            };
        }

        // Update user profile information
        public async Task UpdateUserProfileAsync(string userId, UserUpdateDto updatedUser)
        {
            DocumentReference docRef = _firestoreDb.Collection("users").Document(userId);
            await docRef.SetAsync(updatedUser, SetOptions.MergeAll);
        }
    }
}
