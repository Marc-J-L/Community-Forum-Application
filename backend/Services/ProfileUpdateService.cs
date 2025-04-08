// Services/ProfileUpdateService.cs

using Google.Cloud.Firestore;
using backend.DTOs.Users;
using backend.Models;

namespace backend.Services
{
    public class ProfileUpdateService
    {
        private readonly FirestoreDb _firestoreDb;

        public ProfileUpdateService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // Fetch the user's profile from Firestore
        public async Task<UserInfoDto?> GetUserProfileAsync(string id)
        {
            try
            {
                DocumentReference docRef = _firestoreDb.Collection("users").Document(id);
                DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

                if (!snapshot.Exists)
                {
                    return null;
                }

                var user = snapshot.ConvertTo<User>(); // Use User model

                // Map User to UserInfoDto
                var userDto = new UserInfoDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    DOB = user.DOB,
                    Gender = user.Gender,
                    Bio = user.Bio,
                    ProfileImageUrl = user.ProfileImageUrl,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt,
                    Email = user.Email
                };

                return userDto;
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine("Exception in GetUserProfileAsync: " + ex.ToString());
                // Optionally, rethrow or handle the exception as needed
                throw;
            }
        }

        // Update the user's profile in Firestore
        public async Task UpdateUserProfileAsync(string id, UserUpdateDto updatedProfile)
        {
            try
            {
                DocumentReference docRef = _firestoreDb.Collection("users").Document(id);

                // Create a dictionary of fields to update
                var updates = new Dictionary<string, object>();

                if (!string.IsNullOrEmpty(updatedProfile.FirstName))
                    updates["FirstName"] = updatedProfile.FirstName;

                if (!string.IsNullOrEmpty(updatedProfile.LastName))
                    updates["LastName"] = updatedProfile.LastName;

                if (!string.IsNullOrEmpty(updatedProfile.DOB))
                    updates["DOB"] = updatedProfile.DOB;

                if (!string.IsNullOrEmpty(updatedProfile.Gender))
                    updates["Gender"] = updatedProfile.Gender;

                if (!string.IsNullOrEmpty(updatedProfile.Bio))
                    updates["Bio"] = updatedProfile.Bio;

                if (!string.IsNullOrEmpty(updatedProfile.ProfileImageUrl))
                    updates["ProfileImageUrl"] = updatedProfile.ProfileImageUrl;

                if (!string.IsNullOrEmpty(updatedProfile.Role))
                    updates["Role"] = updatedProfile.Role;

                if (updates.Count > 0)
                {
                    await docRef.UpdateAsync(updates);
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine("Exception in UpdateUserProfileAsync: " + ex.ToString());
                throw;
            }
        }
    }
}
