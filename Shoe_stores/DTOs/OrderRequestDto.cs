using System.ComponentModel.DataAnnotations;
using ShoeStoreBackend.DTOs;

public class OrderRequestDto
{
    [Required]
    public string PaymentMethod { get; set; } = string.Empty;
}
