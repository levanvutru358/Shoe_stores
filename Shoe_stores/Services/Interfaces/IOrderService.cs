public interface IOrderService
{
    Task<OrderResponseDto> PlaceOrderAsync(int userId, OrderRequestDto request);
    Task<List<OrderResponseDto>> GetUserOrdersAsync(int userId);
    Task<decimal> GetRevenueByDayAsync(DateTime date);
    Task<decimal> GetRevenueByMonthAsync(int year, int month);
    Task<decimal> GetRevenueByYearAsync(int year);
    Task<List<OrderStatusSummaryDto>> GetOrderStatusSummaryAsync();
    Task<List<OrderResponseDto>> GetOrdersByStatusAsync(string status);
    Task<List<TopProductDto>> GetTopSellingProductsAsync(int top, DateTime? startDate, DateTime? endDate);
    Task<List<LoyalCustomerDto>> GetTopCustomersAsync(int top, DateTime? startDate, DateTime? endDate);
    Task<List<CategoryRevenueDto>> GetRevenueByCategoryAsync(DateTime? startDate, DateTime? endDate);
}
