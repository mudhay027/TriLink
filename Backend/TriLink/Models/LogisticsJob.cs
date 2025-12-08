using System.ComponentModel.DataAnnotations;

namespace TriLink.Models
{
    public class LogisticsJob
    {
        public int Id { get; set; }

        // Link to Order by Id (no FK enforced yet)
        public int OrderId { get; set; }

        [Required, MaxLength(200)]
        public string PickupAddressLine1 { get; set; } = null!;

        [MaxLength(200)]
        public string? PickupAddressLine2 { get; set; }

        [Required, MaxLength(100)]
        public string PickupCity { get; set; } = null!;

        [Required, MaxLength(100)]
        public string PickupState { get; set; } = null!;

        [Required, MaxLength(20)]
        public string PickupPincode { get; set; } = null!;

        [Required, MaxLength(100)]
        public string PickupCountry { get; set; } = null!;

        [Required, MaxLength(200)]
        public string DropAddressLine1 { get; set; } = null!;

        [MaxLength(200)]
        public string? DropAddressLine2 { get; set; }

        [Required, MaxLength(100)]
        public string DropCity { get; set; } = null!;

        [Required, MaxLength(100)]
        public string DropState { get; set; } = null!;

        [Required, MaxLength(20)]
        public string DropPincode { get; set; } = null!;

        [Required, MaxLength(100)]
        public string DropCountry { get; set; } = null!;

        public decimal? EstimatedWeightKg { get; set; }

        [Required, MaxLength(30)]
        public string Status { get; set; } = "Open";

        // Selected quote (if any)
        public int? SelectedQuoteId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
