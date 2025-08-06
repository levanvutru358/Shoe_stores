using Microsoft.EntityFrameworkCore;
using ShoeStoreBackend.Data;
using ShoeStoreBackend.Dtos;
using ShoeStoreBackend.Models;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;

    public OrderService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<OrderResponseDto> PlaceOrderAsync(int userId, OrderRequestDto request)
    {
        var cartItems = await _context.CartItems
            .Include(ci => ci.Product)
            .Where(ci => ci.UserId == userId)
            .ToListAsync();

        if (!cartItems.Any())
            throw new Exception("Giỏ hàng của bạn đang trống.");

        var totalAmount = cartItems.Sum(i => i.Product.Price * i.Quantity);

        var order = new Order
        {
            UserId = userId,
            OrderDate = DateTime.Now,
            PaymentMethod = request.PaymentMethod,
            TotalAmount = totalAmount,
            OrderItems = cartItems.Select(ci => new OrderItem
            {
                ProductId = ci.ProductId,
                Quantity = ci.Quantity,
                Price = ci.Product.Price
            }).ToList()
        };

        _context.Orders.Add(order);

        _context.CartItems.RemoveRange(cartItems); // clear cart
        await _context.SaveChangesAsync();

        return new OrderResponseDto
        {
            Id = order.Id,
            OrderDate = order.OrderDate,
            PaymentMethod = order.PaymentMethod,
            TotalAmount = order.TotalAmount,
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductName = _context.Products.FirstOrDefault(p => p.Id == oi.ProductId)?.Name,
                Quantity = oi.Quantity,
                Price = oi.Price
            }).ToList()
        };
    }

    public async Task<List<OrderResponseDto>> GetUserOrdersAsync(int userId)
    {
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Where(o => o.UserId == userId)
            .ToListAsync();

        return orders.Select(order => new OrderResponseDto
        {
            Id = order.Id,
            OrderDate = order.OrderDate,
            TotalAmount = order.TotalAmount,
            PaymentMethod = order.PaymentMethod,
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductName = oi.Product?.Name,
                Quantity = oi.Quantity,
                Price = oi.Price
            }).ToList()
        }).ToList();
    }
}
