namespace Backend.Models.Domain
{
    public class ChatMessage
    {
        public Guid Id { get; set; }
        public Guid ThreadId { get; set; }
        public Guid SenderId { get; set; }
        public string SenderRole { get; set; } // Buyer, Supplier
        public string MessageType { get; set; } = "Text"; // Text, Offer, System
        public string TextMessage { get; set; }
        public Guid? OfferId { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public ChatThread Thread { get; set; }
        public User Sender { get; set; }
        public Offer Offer { get; set; }
    }
}
