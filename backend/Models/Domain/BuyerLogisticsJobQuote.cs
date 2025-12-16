using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Domain
{
    public class BuyerLogisticsJobQuote
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid JobId { get; set; }

        [ForeignKey("JobId")]
        public BuyerLogisticsJob Job { get; set; }

        [Required]
        public Guid LogisticsProviderId { get; set; }

        [ForeignKey("LogisticsProviderId")]
        public User LogisticsProvider { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal QuoteAmount { get; set; }

        [Required]
        public DateTime EstimatedDeliveryDate { get; set; }

        public string Status { get; set; } = "Pending"; // Pending, Accepted, Rejected

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
