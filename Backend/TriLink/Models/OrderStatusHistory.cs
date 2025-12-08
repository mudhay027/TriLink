using System.ComponentModel.DataAnnotations;
using System;
namespace TriLink.Models
{
    public class OrderStatusHistory
    {
        public int Id { get; set; }

        // Just store IDs for now (no FK constraints yet)
        public int OrderId { get; set; }

        [MaxLength(30)]
        public string? OldStatus { get; set; }

        [Required, MaxLength(30)]
        public string NewStatus { get; set; } = null!;

        public int ChangedByUserId { get; set; }

        [MaxLength(500)]
        public string? Comment { get; set; }

        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    }
}
