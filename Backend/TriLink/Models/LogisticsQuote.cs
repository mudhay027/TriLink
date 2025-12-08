using System.ComponentModel.DataAnnotations;

namespace TriLink.Models
{
    public class LogisticsQuote
    {
        public int Id { get; set; }

        public int LogisticsJobId { get; set; }

        // Id of the logistics partner (user)
        public int LogisticsPartnerId { get; set; }

        public decimal QuotedPrice { get; set; }

        [MaxLength(50)]
        public string? VehicleType { get; set; }

        public DateTime? ExpectedPickupTime { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; }

        [Required, MaxLength(20)]
        public string Status { get; set; } = "Pending"; // Pending / Accepted / Rejected

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
