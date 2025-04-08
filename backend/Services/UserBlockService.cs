using Google.Cloud.Firestore;
using backend.Models;

namespace backend.Services
{
    public class UserBlockService
    {
        private readonly FirestoreDb _firestoreDb;

        public UserBlockService(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // Method to block a user
        public async Task BlockUserAsync(string blockingUserId, string blockedUserId)
        {
            // Check if the block already exists (optional)
            var existingBlockQuery = _firestoreDb.Collection("blocks")
                .WhereEqualTo("BlockingUserId", blockingUserId)
                .WhereEqualTo("BlockedUserId", blockedUserId);

            QuerySnapshot querySnapshot = await existingBlockQuery.GetSnapshotAsync();

            // Log a message if the user has already blocked this user (optional)
            if (querySnapshot.Documents.Any())
            {
                Console.WriteLine("User already blocked this user.");
                // Optionally, you can return or handle this case differently
                return; // Exit the method without creating a new block
            }

            // Create the block
            DocumentReference docRef = _firestoreDb.Collection("blocks").Document();
            var newBlock = new UserBlock
            {
                Id = docRef.Id,
                BlockingUserId = blockingUserId,
                BlockedUserId = blockedUserId,
            };

            await docRef.SetAsync(newBlock);
        }


        // Method to unblock a user
        public async Task UnblockUserAsync(string blockingUserId, string blockedUserId)
        {
            var blockQuery = _firestoreDb.Collection("blocks")
                .WhereEqualTo("BlockingUserId", blockingUserId)
                .WhereEqualTo("BlockedUserId", blockedUserId);

            QuerySnapshot blockSnapshot = await blockQuery.GetSnapshotAsync();

            if (!blockSnapshot.Documents.Any())
            {
                throw new InvalidOperationException("block_not_found");
            }

            foreach (var blockDoc in blockSnapshot.Documents)
            {
                await blockDoc.Reference.DeleteAsync();
            }
        }

        // Method to get all blocks involving a user (either as blocker or blocked)
        public async Task<List<UserBlock>> GetBlocksByUserIdAsync(string userId)
        {
            // Query for records where the user is the one being blocked
            Query blockedQuery = _firestoreDb.Collection("blocks")
                .WhereEqualTo("BlockingUserId", userId);

            // Get results for the query
            QuerySnapshot blockedSnapshot = await blockedQuery.GetSnapshotAsync();

            var blocks = new List<UserBlock>();

            foreach (DocumentSnapshot docSnapshot in blockedSnapshot.Documents)
            {
                blocks.Add(docSnapshot.ConvertTo<UserBlock>());
            }

            return blocks;
        }

    }
}
