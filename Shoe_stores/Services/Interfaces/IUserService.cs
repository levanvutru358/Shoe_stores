using ShoeStoreBackend.DTOs;
using ShoeStoreBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShoeStoreBackend.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto> GetUserByIdAsync(int id);
        Task<UserDto> CreateUserAsync(UserDto userDto);
        Task<UserDto> UpdateUserAsync(int id, UserDto userDto);
        Task<bool> DeleteUserAsync(int id);
    }
}