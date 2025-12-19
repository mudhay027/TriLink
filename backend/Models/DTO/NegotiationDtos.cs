namespace Backend.Models.DTO
{
    public class NegotiationDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } // Flattened
        public decimal ProductBasePrice { get; set; } // Product's base price
        public string ProductUnit { get; set; } // Product's unit (e.g. Ton, Kg)
        public string ProductImageUrl { get; set; } // Product image
        public Guid BuyerId { get; set; }
        public string BuyerName { get; set; }
        public string BuyerCompanyName { get; set; }
        public string BuyerEmail { get; set; }
        public string BuyerContactNumber { get; set; }
        public Guid SellerId { get; set; }
        public string SellerName { get; set; }
        public string SellerCompanyName { get; set; }
        public string Status { get; set; }
        public decimal CurrentOfferAmount { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal Quantity { get; set; } // Requested quantity
        public string Unit { get; set; } // Unit of measurement
        public decimal ProductQuantity { get; set; } // Quantity from product
        public DateTime? DesiredDeliveryDate { get; set; } // When buyer needs the product
        public List<OfferDto> Offers { get; set; }
    }

    public class CreateNegotiationDto
    {
        public Guid ProductId { get; set; }
        public decimal InitialOfferAmount { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal TotalPrice { get; set; }
        public string Message { get; set; }
        public decimal Quantity { get; set; } // Buyer's requested quantity
        public string Unit { get; set; } // Unit of measurement
        public DateTime? DesiredDeliveryDate { get; set; } // When buyer needs the product
        public string? Status { get; set; } // Optional status override
    }

    public class OfferDto
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal TotalPrice { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid ProposerId { get; set; }
        public Guid SenderId { get; set; }
        public decimal Quantity { get; set; }
        public string Status { get; set; }
    }

    public class AddOfferDto
    {
        public decimal Amount { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal TotalPrice { get; set; }
        public string Message { get; set; }
        public decimal Quantity { get; set; }
    }

    public class UpdateNegotiationStatusDto
    {
        public string Status { get; set; } // Accepted, Rejected
        public Guid? OfferId { get; set; }
    }
}
