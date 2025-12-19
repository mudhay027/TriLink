namespace Backend.Models.Domain
{
    public class Order
    {
        public Guid Id { get; set; }
        public Guid NegotiationId { get; set; }
        public Negotiation Negotiation { get; set; }

        public Guid ProductId { get; set; }
        public Product Product { get; set; }

        public Guid BuyerId { get; set; }
        public User Buyer { get; set; }

        public Guid SellerId { get; set; }
        public User Seller { get; set; }

        public decimal FinalPrice { get; set; } // Legacy field, same as TotalPrice
        public decimal PricePerUnit { get; set; }
        public decimal Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = "Confirmed"; // Confirmed, Shipped, Delivered

        public DateTime CreatedAt { get; set; }
    }
}
