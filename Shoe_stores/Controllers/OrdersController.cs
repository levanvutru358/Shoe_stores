using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/orders")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> PlaceOrder([FromBody] OrderRequestDto request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var result = await _orderService.PlaceOrderAsync(userId, request);
        return Ok(result);
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetUserOrders()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var orders = await _orderService.GetUserOrdersAsync(userId);
        return Ok(orders);
    }

    // Revenue endpoints (Admin only)
    [HttpGet("revenue/daily")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetDailyRevenue([FromQuery] DateTime? date)
    {
        if (!date.HasValue)
            return BadRequest(new { message = "Missing 'date' query param (yyyy-MM-dd)." });
        var total = await _orderService.GetRevenueByDayAsync(date.Value);
        return Ok(new { period = date.Value.ToString("yyyy-MM-dd"), totalRevenue = total });
    }

    [HttpGet("revenue/monthly")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetMonthlyRevenue([FromQuery] int year, [FromQuery] int month)
    {
        if (month < 1 || month > 12)
            return BadRequest(new { message = "'month' must be 1-12." });
        if (year < 1)
            return BadRequest(new { message = "'year' must be >= 1." });
        var total = await _orderService.GetRevenueByMonthAsync(year, month);
        return Ok(new { period = $"{year:D4}-{month:D2}", totalRevenue = total });
    }

    [HttpGet("revenue/yearly")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetYearlyRevenue([FromQuery] int year)
    {
        if (year < 1)
            return BadRequest(new { message = "'year' must be >= 1." });
        var total = await _orderService.GetRevenueByYearAsync(year);
        return Ok(new { period = $"{year:D4}", totalRevenue = total });
    }
}
