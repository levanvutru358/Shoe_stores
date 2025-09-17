using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoeStoreBackend.DTOs;
using ShoeStoreBackend.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ShoeStoreBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CommentsController(ICommentService commentService, IHttpContextAccessor httpContextAccessor)
        {
            _commentService = commentService;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("{productId}")]
        [Authorize] // Yêu cầu đăng nhập
        public async Task<IActionResult> CreateComment(int productId, [FromBody] CommentCreateDto dto)
        {
            Console.WriteLine($"Request received for productId: {productId}"); // Thêm log để debug
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });
            }

            var userIdClaim = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng." });
            }

            var userId = int.Parse(userIdClaim);
            dto.ProductId = productId;

            try
            {
                var comment = await _commentService.CreateCommentAsync(dto, userId);
                return CreatedAtAction(nameof(GetCommentById), new { id = comment.Id }, comment);
            }
            catch (BadHttpRequestException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetComments(int productId)
        {
            Console.WriteLine($"Request received for productId: {productId}"); // Thêm log để debug
            var comments = await _commentService.GetCommentsByProductAsync(productId);
            return Ok(comments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCommentById(int id)
        {
            Console.WriteLine($"Request received for commentId: {id}"); // Thêm log để debug
            try
            {
                var comment = await _commentService.GetCommentByIdAsync(id);
                return Ok(comment);
            }
            catch (BadHttpRequestException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize] // Người tạo comment hoặc Admin có thể chỉnh sửa
        public async Task<IActionResult> UpdateComment(int id, [FromBody] CommentCreateDto dto)
        {
            Console.WriteLine($"Request received for commentId: {id}"); // Thêm log để debug
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });
            }

            var userIdClaim = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng." });
            }

            var userId = int.Parse(userIdClaim);

            try
            {
                var comment = await _commentService.UpdateCommentAsync(id, dto, userId);
                return Ok(comment);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(new { message = ex.Message }); // Sử dụng Forbid của ControllerBase
            }
            catch (BadHttpRequestException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        private IActionResult Forbid(object value)
        {
            throw new NotImplementedException();
        }

        [HttpDelete("{id}")]
        [Authorize] // Người tạo comment hoặc Admin có thể xóa
        public async Task<IActionResult> DeleteComment(int id)
        {
            Console.WriteLine($"Request received for commentId: {id}"); // Thêm log để debug
            var userIdClaim = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new { message = "Không tìm thấy thông tin người dùng." });
            }

            var userId = int.Parse(userIdClaim);

            try
            {
                var result = await _commentService.DeleteCommentAsync(id, userId);
                if (!result) return NotFound(new { message = "Bình luận không tồn tại." });
                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(new { message = ex.Message }); // Sử dụng Forbid của ControllerBase
            }
        }

    
    }
}