// using Microsoft.AspNetCore.Mvc;
// using backend.Models;
// using backend.Services;
// using backend.DTOs.Comment;
// using backend.Middlewares;
// using Google.Cloud.Firestore;
// using FirebaseAdmin.Auth;

// namespace backend.Controllers
// {
//     [ApiController]
//     [Route("[controller]")]
//     public class CommentsController : ControllerBase
//     {
//         private readonly CommentService _commentService;

//         public CommentsController(CommentService commentService)
//         {
//             _commentService = commentService;
//         }

//         // Get a specific comment by ID
//         [HttpGet("{id}")]
//         public async Task<ActionResult<CommentResponseDto>> GetCommentById(string id)
//         {
//             var comment = await _commentService.GetCommentAsync(id);
//             if (comment == null) return NotFound();

//             var responseDto = new CommentResponseDto
//             {
//                 Id = comment.Id,
//                 PostId = comment.PostId,
//                 UserId = comment.UserId,
//                 Content = comment.Content,
//                 CreatedAt = comment.CreatedAt.ToDateTime(),
//                 UpdatedAt = comment.UpdatedAt?.ToDateTime(),
//             };

//             return Ok(responseDto);
//         }

//         // Get all comments or comments filtered by postId
//         [HttpGet("by-post")]
//         public async Task<ActionResult<IEnumerable<CommentResponseDto>>> GetCommentsByPost([FromQuery] string? postId)
//         {
//             var comments = postId != null
//                 ? await _commentService.GetCommentsByPostIdAsync(postId)
//                 : await _commentService.GetAllCommentsAsync();

//             var responseDtos = comments.Select(comment => new CommentResponseDto
//             {
//                 Id = comment.Id,
//                 PostId = comment.PostId,
//                 UserId = comment.UserId,
//                 Content = comment.Content,
//                 CreatedAt = comment.CreatedAt.ToDateTime(),
//                 UpdatedAt = comment.UpdatedAt?.ToDateTime(),
//             });

//             return Ok(responseDtos);
//         }

//         // Create a new comment
//         [HttpPost]
//         [FirebaseAuth]
//         public async Task<ActionResult<CommentResponseDto>> Post([FromBody] CreateCommentDto commentDto)
//         {
//             var firebaseToken = HttpContext.Items["User"] as FirebaseToken;
//             if (firebaseToken == null) return Unauthorized();

//             var newComment = new Comment
//             {
//                 Id = Guid.NewGuid().ToString(),
//                 PostId = commentDto.PostId,
//                 UserId = firebaseToken.Uid,
//                 Content = commentDto.Content,
//                 CreatedAt = Timestamp.FromDateTime(DateTime.UtcNow),
//                 UpdatedAt = null
//             };

//             await _commentService.AddCommentAsync(newComment);
//             // Increment comments count in the post document
//             bool isSuccess = await _commentService.IncrementCommentsCountAsync(commentDto.PostId);
//             var responseDto = new CommentResponseDto
//             {
//                 Id = newComment.Id,
//                 PostId = newComment.PostId,
//                 UserId = newComment.UserId,
//                 Content = newComment.Content,
//                 CreatedAt = newComment.CreatedAt.ToDateTime(),
//             };


//             return CreatedAtAction(nameof(GetCommentById), new { id = newComment.Id }, responseDto);
//         }

//         // Update a comment by ID
//         [HttpPut("{id}")]
//         [FirebaseAuth]
//         public async Task<ActionResult<CommentResponseDto>> Put(string id, [FromBody] CreateCommentDto updatedCommentDto)
//         {
//             var firebaseToken = HttpContext.Items["User"] as FirebaseToken;
//             if (firebaseToken == null) return Unauthorized();

//             var existingComment = await _commentService.GetCommentAsync(id);
//             if (existingComment == null) return NotFound("Comment not found");

//             existingComment.Content = updatedCommentDto.Content;
//             existingComment.UpdatedAt = Timestamp.FromDateTime(DateTime.UtcNow);

//             await _commentService.UpdateCommentAsync(id, existingComment);

//             var responseDto = new CommentResponseDto
//             {
//                 Id = existingComment.Id,
//                 PostId = existingComment.PostId,
//                 UserId = existingComment.UserId,
//                 Content = existingComment.Content,
//                 CreatedAt = existingComment.CreatedAt.ToDateTime(),
//                 UpdatedAt = existingComment.UpdatedAt?.ToDateTime(),
//             };

//             return Ok(responseDto);
//         }

//         // Delete a comment by ID
//         [HttpDelete("{id}")]
//         [FirebaseAuth]
//         public async Task<ActionResult> Delete(string id)
//         {
//             var firebaseToken = HttpContext.Items["User"] as FirebaseToken;
//             if (firebaseToken == null) return Unauthorized();

//             var comment = await _commentService.GetCommentAsync(id);
//             if (comment == null) return NotFound("Comment not found");

//             await _commentService.DeleteCommentAsync(id);
//             return NoContent();
//         }
//     }
// }




using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using backend.DTOs.Comment;
using backend.Middlewares;
using Google.Cloud.Firestore;
using FirebaseAdmin.Auth;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly CommentService _commentService;
        private readonly FirestoreDb _firestoreDb;

        public CommentController(CommentService commentService, FirestoreDb firestoreDb)
        {
            _commentService = commentService;
            _firestoreDb = firestoreDb;
        }

        // Get a specific comment by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<CommentResponseDto>> GetCommentById(string id)
        {
            var comment = await _commentService.GetCommentAsync(id);
            if (comment == null) return NotFound();

            var responseDto = new CommentResponseDto
            {
                Id = comment.Id,
                PostId = comment.PostId,
                UserId = comment.UserId,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt.ToDateTime(),
                UpdatedAt = comment.UpdatedAt?.ToDateTime(),
            };

            return Ok(responseDto);
        }

        // Get all comments or comments filtered by postId
        [HttpGet("by-post")]
        public async Task<ActionResult<IEnumerable<CommentResponseDto>>> GetCommentsByPost([FromQuery] string? postId)
        {
            var comments = postId != null
                ? await _commentService.GetCommentsByPostIdAsync(postId)
                : await _commentService.GetAllCommentsAsync();

            var responseDtos = comments.Select(comment => new CommentResponseDto
            {
                Id = comment.Id,
                PostId = comment.PostId,
                UserId = comment.UserId,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt.ToDateTime(),
                UpdatedAt = comment.UpdatedAt?.ToDateTime(),
            });

            return Ok(responseDtos);
        }

        // Create a new comment
        [HttpPost]
        [FirebaseAuth]
        public async Task<ActionResult<CommentResponseDto>> Post([FromBody] CreateCommentDto commentDto)
        {
            var firebaseToken = HttpContext.Items["User"] as FirebaseToken;
            if (firebaseToken == null) return Unauthorized();

            var newComment = new Comment
            {
                Id = Guid.NewGuid().ToString(),
                PostId = commentDto.PostId,
                UserId = firebaseToken.Uid,
                Content = commentDto.Content,
                CreatedAt = Timestamp.FromDateTime(DateTime.UtcNow),
                UpdatedAt = null
            };

            await _commentService.AddCommentAsync(newComment);

            // Increment comments count in the post document
            bool isSuccess = await _commentService.IncrementCommentsCountAsync(commentDto.PostId);

            var responseDto = new CommentResponseDto
            {
                Id = newComment.Id,
                PostId = newComment.PostId,
                UserId = newComment.UserId,
                Content = newComment.Content,
                CreatedAt = newComment.CreatedAt.ToDateTime(),
            };

            return CreatedAtAction(nameof(GetCommentById), new { id = newComment.Id }, responseDto);
        }

        // Update a comment by ID
        [HttpPut("{id}")]
        [FirebaseAuth]
        public async Task<ActionResult<CommentResponseDto>> Put(string id, [FromBody] CreateCommentDto updatedCommentDto)
        {
            var firebaseToken = HttpContext.Items["User"] as FirebaseToken;
            if (firebaseToken == null) return Unauthorized();

            var existingComment = await _commentService.GetCommentAsync(id);
            if (existingComment == null) return NotFound("Comment not found");

            existingComment.Content = updatedCommentDto.Content;
            existingComment.UpdatedAt = Timestamp.FromDateTime(DateTime.UtcNow);

            await _commentService.UpdateCommentAsync(id, existingComment);

            var responseDto = new CommentResponseDto
            {
                Id = existingComment.Id,
                PostId = existingComment.PostId,
                UserId = existingComment.UserId,
                Content = existingComment.Content,
                CreatedAt = existingComment.CreatedAt.ToDateTime(),
                UpdatedAt = existingComment.UpdatedAt?.ToDateTime(),
            };

            return Ok(responseDto);
        }

        // // Delete a comment by ID
        // [HttpDelete("{id}")]
        // [FirebaseAuth]
        // public async Task<ActionResult> Delete(string id)
        // {
        //     var firebaseToken = HttpContext.Items["User"] as FirebaseToken;
        //     if (firebaseToken == null) return Unauthorized();

        //     var comment = await _commentService.GetCommentAsync(id);
        //     if (comment == null) return NotFound("Comment not found");

        //     await _commentService.DeleteCommentAsync(id);
        //     return NoContent();
        // }


        [HttpDelete("{id}")]
        [FirebaseAuth]
        public async Task<ActionResult> Delete(string id)
        {
            var firebaseToken = HttpContext.Items["User"] as FirebaseToken;
            if (firebaseToken == null) return Unauthorized();

            // Fetch the comment from the database
            var comment = await _commentService.GetCommentAsync(id);
            if (comment == null) return NotFound("Comment not found");

            // Check if the user is the comment owner or an Admin
            if (comment.UserId != firebaseToken.Uid)
            {
                // Fetch the user's role from Firestore
                DocumentReference userRef = _firestoreDb.Collection("users").Document(firebaseToken.Uid);
                DocumentSnapshot userSnapshot = await userRef.GetSnapshotAsync();

                if (!userSnapshot.Exists || !userSnapshot.ContainsField("Role"))
                {
                    return Forbid("Access denied.");
                }

                var role = userSnapshot.GetValue<string>("Role");
                if (role != "Admin")
                {
                    return Forbid("Only admins or the comment owner can delete this comment.");
                }
            }

            // Allow the deletion if the user is either the comment owner or an Admin
            await _commentService.DeleteCommentAsync(id);
            return NoContent();
        }

    }
}
