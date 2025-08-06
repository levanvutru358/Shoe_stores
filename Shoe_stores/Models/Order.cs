using ShoeStoreBackend.Models;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public decimal TotalAmount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string Status { get; set; } = "Processing";

    public User? User { get; set; }
    public List<OrderItem> OrderItems { get; set; } = new();
}
