namespace Backend.Models.DTO
{
    public class ChatThreadDto
    {
        public Guid Id { get; set; }
        public Guid BuyerId { get; set; }
        public string BuyerName { get; set; }
        public string BuyerCompanyName { get; set; }
        public Guid SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string SupplierCompanyName { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductImageUrl { get; set; }
        public string Status { get; set; }
        public DateTime LastMessageAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public string LastMessage { get; set; }
        public int UnreadCount { get; set; }
    }

    public class ChatMessageDto
    {
        public Guid Id { get; set; }
        public Guid ThreadId { get; set; }
        public Guid SenderId { get; set; }
        public string SenderName { get; set; }
        public string SenderCompanyName { get; set; }
        public string SenderRole { get; set; }
        public string MessageType { get; set; }
        public string TextMessage { get; set; }
        public ChatOfferDto Offer { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ChatOfferDto
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; }
        public string Status { get; set; } // Pending, Accepted, Rejected
        public DateTime CreatedAt { get; set; }
    }

    public class CreateChatThreadDto
    {
        public Guid ProductId { get; set; }
        public Guid SupplierId { get; set; }
        public string InitialMessage { get; set; }
    }

    public class SendMessageDto
    {
        public string TextMessage { get; set; }
    }

    public class CreateOfferMessageDto
    {
        public decimal Amount { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; }
        public string Message { get; set; }
    }

    public class UpdateOfferStatusDto
    {
        public string Status { get; set; } // Accepted, Rejected
    }
}
