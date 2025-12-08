using System.ComponentModel.DataAnnotations;

namespace TriLink.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int? OfferThreadId { get; set; }

        public int ProductId { get; set; }

        public int BuyerId { get; set; }

        public int SupplierId { get; set; }

        public decimal Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal SubTotal { get; set; }

        public decimal TaxAmount { get; set; }

        public decimal TotalAmount { get; set; }

        // 'Created','Confirmed','LogisticsAssigned','Picked','InTransit','Delivered','Closed'
        [Required, MaxLength(30)]
        public string Status { get; set; } = "Created";

        // Link to LogisticsJob (optional)
        public int? LogisticsJobId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
