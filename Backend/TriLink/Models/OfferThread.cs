using System.ComponentModel.DataAnnotations;

namespace TriLink.Models
{
    public class OfferThread
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public int BuyerId { get; set; }

        public int SupplierId { get; set; }

        // 'Open', 'Accepted', 'Rejected', 'Cancelled'
        [Required, MaxLength(20)]
        public string Status { get; set; } = "Open";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ClosedAt { get; set; }
    }
}
