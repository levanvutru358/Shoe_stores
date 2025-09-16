using ShoeStoreBackend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShoeStoreBackend.Services.Interfaces
{
    public interface IOrderService
    {
        Task<OrderResponseDto> PlaceOrderAsync(int userId, OrderRequestDto request);
        Task<List<OrderResponseDto>> GetUserOrdersAsync(int userId);
    }
}