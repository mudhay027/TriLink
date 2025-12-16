namespace Backend.Models.Domain
{
    public class ChatThread
    {
        public Guid Id { get; set; }
        public Guid BuyerId { get; set; }
        public Guid SupplierId { get; set; }
        public Guid ProductId { get; set; }
        public Guid? NegotiationId { get; set; }
        public string Status { get; set; } = "Active"; // Active, Completed, Cancelled
        public DateTime LastMessageAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public User Buyer { get; set; }
        public User Supplier { get; set; }
        public Product Product { get; set; }
        public Negotiation Negotiation { get; set; }
        public List<ChatMessage> Messages { get; set; }
    }
}
