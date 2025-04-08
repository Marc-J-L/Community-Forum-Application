// namespace backend.DTOs.Comment
// {
//     public class CommentResponseDto
//     {
//         public string Id { get; set; }
//         public string PostId { get; set; }
//         public string UserId { get; set; }
//         public string Content { get; set; }
//         public DateTime CreatedAt { get; set; }
//         public DateTime? UpdatedAt { get; set; }
        
//     }
// }
using backend.DTOs.Users;

namespace backend.DTOs.Comment
{
    public class CommentResponseDto
    {
        public string Id { get; set; }
        public string PostId { get; set; }
        public string UserId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public UserInfoDto User { get; set; } // Include user information
    }
}
