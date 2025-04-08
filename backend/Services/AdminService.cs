using Google.Cloud.Firestore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public class AdminService
    {
        private readonly FirestoreDb _firestoreDb;

        public AdminService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // Method to suspend a user
        public async Task SuspendUserAsync(string uid)
        {
            var userDocRef = _firestoreDb.Collection("users").Document(uid);
            await userDocRef.UpdateAsync(new Dictionary<string, object> { { "Role", "Suspended" } });
        }

        // Method to promote a user to admin
        public async Task PromoteToAdminAsync(string uid)
        {
            var userDocRef = _firestoreDb.Collection("users").Document(uid);
            await userDocRef.UpdateAsync(new Dictionary<string, object> { { "Role", "Admin" } });
        }

        // Method to demote a user to a regular user
public async Task DemoteToUserAsync(string uid)
{
    var userDocRef = _firestoreDb.Collection("users").Document(uid);
    await userDocRef.UpdateAsync(new Dictionary<string, object> { { "Role", "User" } });
}

    }
}
