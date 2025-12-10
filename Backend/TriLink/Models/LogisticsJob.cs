using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TriLink.Models
{
    public class LogisticsJob
    {
        public int Id { get; set; }

        public int? OrderId { get; set; } // Optional link to an Order

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
        public string PickupCountry { get; set; } = "India";

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
        public string DropCountry { get; set; } = "India";

        [Column(TypeName = "decimal(18,2)")]
        public decimal EstimatedWeightKg { get; set; }

        [Required, MaxLength(50)]
        public string Status { get; set; } = "Active"; // Active, Draft, Assigned, Completed

        public int? SelectedQuoteId { get; set; }

        public int CreatedByUserId { get; set; } // To link to the Supplier who created it

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
