using Microsoft.EntityFrameworkCore;
using ShoeStoreBackend.Data;
using ShoeStoreBackend.DTOs;
using ShoeStoreBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShoeStoreBackend.Services.Implementations
{
    public class CommentService : ICommentService
    {
        private readonly AppDbContext _context;

        public CommentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CommentDto> CreateCommentAsync(CommentCreateDto dto, int userId)
        {
            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null)
            {
                throw new BadHttpRequestException("Sản phẩm không tồn tại.");
            }

            var comment = new Comment
            {
                Content = dto.Content,
                UserId = userId,
                ProductId = dto.ProductId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);
            return new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                UserId = comment.UserId,
                Username = user?.Username,
                ProductId = comment.ProductId
            };
        }

        public async Task<List<CommentDto>> GetCommentsByProductAsync(int productId)
        {
            return await _context.Comments
                .Where(c => c.ProductId == productId)
                .Select(c => new CommentDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    UserId = c.UserId,
                    Username = c.User.Username,
                    ProductId = c.ProductId
                }).ToListAsync();
        }

        public async Task<CommentDto> UpdateCommentAsync(int commentId, CommentCreateDto dto, int userId)
        {
            var comment = await _context.Comments.FindAsync(commentId);
            if (comment == null)
            {
                throw new BadHttpRequestException("Bình luận không tồn tại.");
            }

            if (comment.UserId != userId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền chỉnh sửa bình luận này.");
            }

            comment.Content = dto.Content;
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);
            return new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                UserId = comment.UserId,
                Username = user?.Username,
                ProductId = comment.ProductId
            };
        }

        public async Task<bool> DeleteCommentAsync(int commentId, int userId)
        {
            var comment = await _context.Comments.FindAsync(commentId);
            if (comment == null)
            {
                return false;
            }

            if (comment.UserId != userId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền xóa bình luận này.");
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<CommentDto> GetCommentByIdAsync(int commentId)
        {
            var comment = await _context.Comments
                .Where(c => c.Id == commentId)
                .Select(c => new CommentDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    UserId = c.UserId,
                    Username = c.User.Username,
                    ProductId = c.ProductId
                }).FirstOrDefaultAsync();

            if (comment == null)
            {
                throw new BadHttpRequestException("Bình luận không tồn tại.");
            }

            return comment;
        }
    }
}