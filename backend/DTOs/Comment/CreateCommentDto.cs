namespace backend.DTOs.Comment
{
    public class CreateCommentDto
    {
        public string PostId { get; set; }
        public string Content { get; set; }
    }
}
