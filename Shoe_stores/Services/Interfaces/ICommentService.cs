using ShoeStoreBackend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShoeStoreBackend.Services
{
    public interface ICommentService
    {
        Task<CommentDto> CreateCommentAsync(CommentCreateDto dto, int userId);
        Task<List<CommentDto>> GetCommentsByProductAsync(int productId);
        Task<CommentDto> UpdateCommentAsync(int commentId, CommentCreateDto dto, int userId);
        Task<bool> DeleteCommentAsync(int commentId, int userId);
        Task<CommentDto> GetCommentByIdAsync(int commentId);
    }
}