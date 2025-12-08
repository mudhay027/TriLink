using System.ComponentModel.DataAnnotations;

namespace TriLink.Models
{
    public class OfferMessage
    {
        public int Id { get; set; }

        public int ThreadId { get; set; }

        public int SenderUserId { get; set; }

        public decimal PricePerUnit { get; set; }

        public decimal Quantity { get; set; }

        // 'Offer', 'Counter', 'System'
        [Required, MaxLength(20)]
        public string MessageType { get; set; } = "Offer";

        [MaxLength(500)]
        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
