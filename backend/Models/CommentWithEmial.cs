using backend.Models;

public class CommentWithEmail
{
    public Comment Comment { get; set; } // The Comment object
    public string UserEmail { get; set; } // User's email associated with the comment
}

