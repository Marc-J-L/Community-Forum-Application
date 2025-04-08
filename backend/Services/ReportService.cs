using Google.Cloud.Firestore;
using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public class ReportService
    {
        private readonly FirestoreDb _db;

        public ReportService(FirestoreDb config)
        {
            _db = config;
        }

        public async Task<Report> GetReportAsync(string id)
        {
            DocumentReference docRef = _db.Collection("reports").Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            // if (snapshot.Exists)
            // {
                return snapshot.ConvertTo<Report>();
            // }
            // return null;
        }

       // Method to get all reports related to a specific community
        public async Task<List<Report>> GetReportsByCommunityAsync(string communityId)
        {
            // Initialize empty list to store the filtered reports
            List<Report> communityReports = new List<Report>();

            // Fetch all reports from Firestore
            CollectionReference reportsCollection = _db.Collection("reports");
            QuerySnapshot allReportsSnapshot = await reportsCollection.GetSnapshotAsync();
            List<Report> allReports = allReportsSnapshot.Documents.Select(doc => doc.ConvertTo<Report>()).ToList();

            // Filter the reports based on the provided communityId
            foreach (var report in allReports)
            {
                if ((report.ReportType == "community" && report.EntityId == communityId) ||
                    (report.ReportType == "post" && report.EntityId == communityId) ||
                    (report.ReportType == "comment" && await IsCommentInCommunity(report.EntityId, communityId)))
                {
                    communityReports.Add(report);
                }
            }

            return communityReports;
        }

        // Helper method to check if a comment belongs to a post within the community
        private async Task<bool> IsCommentInCommunity(string commentId, string communityId)
        {
            // Retrieve the comment
            DocumentReference commentDoc = _db.Collection("comments").Document(commentId);
            DocumentSnapshot commentSnapshot = await commentDoc.GetSnapshotAsync();
            if (commentSnapshot.Exists)
            {
                var comment = commentSnapshot.ConvertTo<Comment>();

                // Retrieve the post associated with the comment
                DocumentReference postDoc = _db.Collection("posts").Document(comment.PostId);
                DocumentSnapshot postSnapshot = await postDoc.GetSnapshotAsync();
                if (postSnapshot.Exists)
                {
                    var post = postSnapshot.ConvertTo<Post>();

                    // Check if the post belongs to the specified community
                    return post.CommunityId == communityId;
                }
            }

            return false;
        }

        // public async Task<List<Report>> GetAllReportsAsync()
        // {
        //     QuerySnapshot snapshot = await _db.Collection("reports").GetSnapshotAsync();
        //     var reports = new List<Report>();

        //     foreach (DocumentSnapshot document in snapshot.Documents)
        //     {
        //         reports.Add(document.ConvertTo<Report>());
        //     }

        //     return reports;
        // }

        // public async Task<List<Report>> GetAllReportsAsync()
        // {
        //     QuerySnapshot snapshot = await _db.Collection("reports").GetSnapshotAsync();
        //     var reports = new List<Report>();

        //     foreach (DocumentSnapshot document in snapshot.Documents)
        //     {
        //         var report = document.ConvertTo<Report>();

        //         // Check if the report is for a comment
        //         if (report.ReportType == "comment")
        //         {
        //             // Fetch comment details based on EntityId
        //             var comment = await GetCommentByIdAsync(report.EntityId);
        //             if (comment != null)
        //             {
        //                 // Attach the comment details to the report
        //                 report.Comment = comment;
        //             }
        //         }

        //         reports.Add(report);
        //     }

        //     return reports;
        // }
        public async Task<List<Report>> GetAllReportsAsync()
        {
            QuerySnapshot snapshot = await _db.Collection("reports").GetSnapshotAsync();
            var reports = new List<Report>();

            foreach (DocumentSnapshot document in snapshot.Documents)
            {
                var report = document.ConvertTo<Report>();

                // Check if the report is for a comment
                if (report.ReportType == "comment")
                {
                    // Fetch comment details based on EntityId
                    var comment = await GetCommentByIdAsync(report.EntityId);
                    if (comment != null)
                    {
                        // Fetch user email for the comment's UserId
                        var userEmail = await GetUserEmailByIdAsync(comment.UserId);

                        // Create a CommentWithEmail object
                        report.Comment = new CommentWithEmail
                        {
                            Comment = comment,
                            UserEmail = userEmail
                        };
                    }
                }

                reports.Add(report);
            }

            return reports;
        }


        public async Task<Comment?> GetCommentByIdAsync(string commentId)
        {
            DocumentSnapshot snapshot = await _db.Collection("comments").Document(commentId).GetSnapshotAsync();
            if (snapshot.Exists)
            {
                return snapshot.ConvertTo<Comment>();
            }
            return null;
        }

        public async Task<string?> GetUserEmailByIdAsync(string userId)
        {
            DocumentSnapshot snapshot = await _db.Collection("users").Document(userId).GetSnapshotAsync();
            if (snapshot.Exists)
            {
                var user = snapshot.ConvertTo<User>(); // Assuming you have a User model
                return user.Email;
            }
            return null;
        }


        public async Task AddReportAsync(string reporterId, Report report)
        {
            // Automatically set the CreatedAt property
            report.CreatedAt = Timestamp.GetCurrentTimestamp(); // Assuming this method is correctly implemented
            report.ReporterId = reporterId; // Set the reporterId

            // Create a new document reference and generate an ID
            DocumentReference docRef = _db.Collection("reports").Document();

             Console.WriteLine(docRef);

            
            // Set the report ID to the generated document ID
            report.Id = docRef.Id; // Set the generated ID

           
            // Save the report to Firestore
            await docRef.SetAsync(report); // This saves the report to the Firestore
        }



        public async Task DeleteReportAsync(string id)
        {
            DocumentReference docRef = _db.Collection("reports").Document(id);
            await docRef.DeleteAsync();
        }
    }
}
