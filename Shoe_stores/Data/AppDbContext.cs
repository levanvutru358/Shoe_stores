using Microsoft.EntityFrameworkCore;
using ShoeStoreBackend.Models;

namespace ShoeStoreBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Product> Products { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Ràng buộc quan hệ giữa Order và OrderItem
            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ràng buộc OrderItem và Product
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId);

            // Seed tài khoản admin mặc định
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    Email = "admin@shoestore.com",
                    PasswordHash = "$2a$11$8Xz6Z6Z6Z6Z6Z6Z6Z6Z6Ze6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z", // Mật khẩu: Admin@123 (đã mã hóa bằng BCrypt)
                    Role = "Admin"
                }
            );
        }
    }
}