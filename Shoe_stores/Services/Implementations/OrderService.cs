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
            Status = order.Status,
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
            Status = order.Status,
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductName = oi.Product?.Name,
                Quantity = oi.Quantity,
                Price = oi.Price
            }).ToList()
        }).ToList();
    }

    public async Task<decimal> GetRevenueByDayAsync(DateTime date)
    {
        var start = date.Date;
        var end = start.AddDays(1);
        var sum = await _context.Orders
            .Where(o => o.OrderDate >= start && o.OrderDate < end)
            .Select(o => (decimal?)o.TotalAmount)
            .SumAsync();
        return sum ?? 0m;
    }

    public async Task<decimal> GetRevenueByMonthAsync(int year, int month)
    {
        var start = new DateTime(year, month, 1);
        var end = start.AddMonths(1);
        var sum = await _context.Orders
            .Where(o => o.OrderDate >= start && o.OrderDate < end)
            .Select(o => (decimal?)o.TotalAmount)
            .SumAsync();
        return sum ?? 0m;
    }

    public async Task<decimal> GetRevenueByYearAsync(int year)
    {
        var start = new DateTime(year, 1, 1);
        var end = start.AddYears(1);
        var sum = await _context.Orders
            .Where(o => o.OrderDate >= start && o.OrderDate < end)
            .Select(o => (decimal?)o.TotalAmount)
            .SumAsync();
        return sum ?? 0m;
    }

    public async Task<List<OrderStatusSummaryDto>> GetOrderStatusSummaryAsync()
    {
        var summaries = await _context.Orders
            .GroupBy(o => o.Status)
            .Select(g => new OrderStatusSummaryDto
            {
                Status = g.Key,
                Count = g.Count(),
                TotalAmount = g.Sum(o => o.TotalAmount)
            })
            .ToListAsync();

        return summaries;
    }

    public async Task<List<OrderResponseDto>> GetOrdersByStatusAsync(string status)
    {
        var normalized = status.Trim();
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Where(o => o.Status == normalized)
            .ToListAsync();

        return orders.Select(order => new OrderResponseDto
        {
            Id = order.Id,
            OrderDate = order.OrderDate,
            TotalAmount = order.TotalAmount,
            PaymentMethod = order.PaymentMethod,
            Status = order.Status,
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductName = oi.Product?.Name,
                Quantity = oi.Quantity,
                Price = oi.Price
            }).ToList()
        }).ToList();
    }

    public async Task<List<TopProductDto>> GetTopSellingProductsAsync(int top, DateTime? startDate, DateTime? endDate)
    {
        if (top <= 0) top = 10;

        var query = _context.OrderItems
            .Include(oi => oi.Product)
            .Include(oi => oi.Order)
            .AsQueryable();

        if (startDate.HasValue)
        {
            query = query.Where(oi => oi.Order.OrderDate >= startDate.Value);
        }
        if (endDate.HasValue)
        {
            query = query.Where(oi => oi.Order.OrderDate < endDate.Value);
        }

        var results = await query
            .GroupBy(oi => new { oi.ProductId, oi.Product.Name, oi.Product.ImageUrl, oi.Product.Category })
            .Select(g => new TopProductDto
            {
                ProductId = g.Key.ProductId,
                Name = g.Key.Name,
                ImageUrl = g.Key.ImageUrl,
                Category = g.Key.Category,
                TotalQuantity = g.Sum(x => x.Quantity),
                TotalRevenue = g.Sum(x => x.Price * x.Quantity)
            })
            .OrderByDescending(x => x.TotalQuantity)
            .ThenByDescending(x => x.TotalRevenue)
            .Take(top)
            .ToListAsync();

        return results;
    }

    public async Task<List<LoyalCustomerDto>> GetTopCustomersAsync(int top, DateTime? startDate, DateTime? endDate)
    {
        if (top <= 0) top = 10;

        var itemQuery = _context.OrderItems
            .Include(oi => oi.Order)
            .AsQueryable();

        if (startDate.HasValue)
        {
            itemQuery = itemQuery.Where(oi => oi.Order.OrderDate >= startDate.Value);
        }
        if (endDate.HasValue)
        {
            itemQuery = itemQuery.Where(oi => oi.Order.OrderDate < endDate.Value);
        }

        // Group by customer through Order.UserId
        var grouped = await itemQuery
            .GroupBy(oi => oi.Order.UserId)
            .Select(g => new
            {
                UserId = g.Key,
                TotalQuantity = g.Sum(x => x.Quantity),
                TotalSpent = g.Sum(x => x.Price * x.Quantity),
                TotalOrders = g.Select(x => x.OrderId).Distinct().Count(),
                LastOrderDate = g.Max(x => x.Order.OrderDate)
            })
            .OrderByDescending(x => x.TotalSpent)
            .ThenByDescending(x => x.TotalOrders)
            .Take(top)
            .ToListAsync();

        // Join with Users to fetch display info
        var userIds = grouped.Select(x => x.UserId).ToList();
        var users = await _context.Users
            .Where(u => userIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u);

        var result = grouped.Select(x => new LoyalCustomerDto
        {
            UserId = x.UserId,
            Username = users.TryGetValue(x.UserId, out var u) ? u.Username : string.Empty,
            Email = users.TryGetValue(x.UserId, out var u2) ? u2.Email : string.Empty,
            TotalOrders = x.TotalOrders,
            TotalQuantity = x.TotalQuantity,
            TotalSpent = x.TotalSpent,
            LastOrderDate = x.LastOrderDate
        }).ToList();

        return result;
    }

    public async Task<List<CategoryRevenueDto>> GetRevenueByCategoryAsync(DateTime? startDate, DateTime? endDate)
    {
        var query = _context.OrderItems
            .Include(oi => oi.Product)
            .Include(oi => oi.Order)
            .AsQueryable();

        if (startDate.HasValue)
        {
            query = query.Where(oi => oi.Order.OrderDate >= startDate.Value);
        }
        if (endDate.HasValue)
        {
            query = query.Where(oi => oi.Order.OrderDate < endDate.Value);
        }

        var list = await query
            .GroupBy(oi => oi.Product.Category)
            .Select(g => new CategoryRevenueDto
            {
                Category = g.Key ?? "Uncategorized",
                TotalQuantity = g.Sum(x => x.Quantity),
                TotalRevenue = g.Sum(x => x.Price * x.Quantity)
            })
            .OrderByDescending(x => x.TotalRevenue)
            .ToListAsync();

        return list;
    }
}
