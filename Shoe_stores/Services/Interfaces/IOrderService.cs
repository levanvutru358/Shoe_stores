public interface IOrderService
{
    Task<OrderResponseDto> PlaceOrderAsync(int userId, OrderRequestDto request);
    Task<List<OrderResponseDto>> GetUserOrdersAsync(int userId);
}
