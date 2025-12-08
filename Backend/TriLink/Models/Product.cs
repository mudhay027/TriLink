using System.ComponentModel.DataAnnotations;

namespace TriLink.Models
{
    public class Product
    {
        public int Id { get; set; }

        // FK -> User (Supplier)
        public int SupplierId { get; set; }

        [Required, MaxLength(200)]
        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        [MaxLength(100)]
        public string? Category { get; set; }

        [Required, MaxLength(50)]
        public string Unit { get; set; } = null!;   // kg, ton, litre...

        public decimal AvailableQuantity { get; set; }

        public decimal BasePricePerUnit { get; set; }

        public decimal? MinOrderQuantity { get; set; }

        public int? LeadTimeDays { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }       // blob URL

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
