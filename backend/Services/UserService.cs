// Services/UserService.cs
// using Google.Cloud.Firestore;
// using backend.Models;
//
//
// namespace backend.Services
// {
//     public class UserService
//     {
//         private readonly FirestoreDb _db;
//
//         public UserService(FirestoreDb config)
//         {
//             _db = config;
//         }
//
//         public async Task<User> GetUserAsync(string id)
//         {
//             DocumentReference docRef = _db.Collection("users").Document(id);
//             DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
//
//             if (snapshot.Exists)
//             {
//                 return snapshot.ConvertTo<User>();
//             }
//             return null;
//         }
//
//         public async Task<IEnumerable<User>> GetAllUsersAsync()
//         {
//             QuerySnapshot snapshot = await _db.Collection("users").GetSnapshotAsync();
//             var users = new List<User>();
//
//             foreach (DocumentSnapshot document in snapshot.Documents)
//             {
//                 users.Add(document.ConvertTo<User>());
//             }
//
//             return users;
//         }
//
//         public async Task AddUserAsync(User user)
//         {
//             DocumentReference docRef = _db.Collection("users").Document(user.Id);
//             await docRef.SetAsync(user);
//         }
//
//         public async Task UpdateUserAsync(string id, User user)
//         {
//             DocumentReference docRef = _db.Collection("users").Document(id);
//             await docRef.SetAsync(user, SetOptions.MergeAll);
//         }
//
//         public async Task DeleteUserAsync(string id)
//         {
//             DocumentReference docRef = _db.Collection("users").Document(id);
//             await docRef.DeleteAsync();
//         }
//     }
// }




using Google.Cloud.Firestore;
using backend.Models;
using backend.DTOs.Users;

namespace backend.Services
{
    public class UserService
    {
        private readonly FirestoreDb _firestoreDb;

        public UserService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // Method to create a new user profile in Firestore
        public async Task AddUserAsync(User user)
        {
            DocumentReference docRef = _firestoreDb.Collection("users").Document(user.Id);
            await docRef.SetAsync(user);
        }

        // Method to fetch a user by their ID from Firestore
        public async Task<UserInfoDto?> GetUserAsync(string id)
        {
            DocumentReference docRef = _firestoreDb.Collection("users").Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (!snapshot.Exists)
            {
                return null;
            }

            var user = snapshot.ConvertTo<User>();
            return ConvertToUserInfoDto(user);
        }

        // Method to get all users from Firestore
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            QuerySnapshot snapshot = await _firestoreDb.Collection("users").GetSnapshotAsync();
            return snapshot.Documents.Select(doc => doc.ConvertTo<User>()).ToList();
        }

        // Method to update a user's profile in Firestore
        public async Task UpdateUserAsync(string id, User updatedUser)
        {
            DocumentReference docRef = _firestoreDb.Collection("users").Document(id);
            await docRef.SetAsync(updatedUser, SetOptions.MergeAll);
        }

        // Method to delete a user from Firestore
        public async Task DeleteUserAsync(string id)
        {
            DocumentReference docRef = _firestoreDb.Collection("users").Document(id);
            await docRef.DeleteAsync();
        }

        public UserInfoDto ConvertToUserInfoDto(User user)
        {
            return new UserInfoDto
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
                Email = user.Email,
            };
        }
    }
}