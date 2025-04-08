using Google.Cloud.Firestore;
using backend.Models;

[FirestoreData]
public class Report
{
    [FirestoreDocumentId]
    public string? Id { get; set; }

    [FirestoreProperty]
    public string? ReporterId { get; set; }

    [FirestoreProperty]
    public string ReportType { get; set; } // e.g., "comment", "post", "community"

    [FirestoreProperty]
    public string EntityId { get; set; } // ID of the comment, post, or community being reported

    [FirestoreProperty]
    public Timestamp CreatedAt { get; set; } = Timestamp.GetCurrentTimestamp(); // Initialize with current timestamp

    [FirestoreProperty]
    public string Reason { get; set; }

    public CommentWithEmail? Comment { get; set; } 
}
