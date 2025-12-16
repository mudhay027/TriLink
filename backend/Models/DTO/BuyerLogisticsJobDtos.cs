using System;

namespace Backend.Models.DTO
{
    public class CreateBuyerLogisticsJobDto
    {
        // Pickup Details
        public string PickupAddressLine1 { get; set; }
        public string PickupAddressLine2 { get; set; }
        public string PickupLandmark { get; set; }
        public string PickupCity { get; set; }
        public string PickupState { get; set; }
        public string PickupPincode { get; set; }
        
        // Drop Details
        public string DropAddressLine1 { get; set; }
        public string DropAddressLine2 { get; set; }
        public string DropLandmark { get; set; }
        public string DropCity { get; set; }
        public string DropState { get; set; }
        public string DropPincode { get; set; }
        
        // Timing & Schedule
        public DateTime PickupDate { get; set; }
        public string PickupTimeSlot { get; set; }
        public DateTime DeliveryExpectedDate { get; set; }
        public string DeliveryTimeWindow { get; set; }
        public string ShipmentPriority { get; set; }
        
        // Pallet & Load Details
        public int PalletCount { get; set; }
        public decimal TotalWeight { get; set; }
        public decimal? Length { get; set; }
        public decimal? Width { get; set; }
        public decimal? Height { get; set; }
        public string MaterialType { get; set; }
        public bool IsFragile { get; set; }
        public bool IsHighValue { get; set; }
        public string SpecialHandling { get; set; }
        
        // Documentation & Compliance
        public string EwayBillNumber { get; set; }
        public string InvoiceNumber { get; set; }
        public string GstNumber { get; set; }
        public string MaterialCategory { get; set; }
        
        // Sender Contact
        public string SenderName { get; set; }
        public string SenderCompanyName { get; set; }
        public string SenderMobile { get; set; }
        public string SenderEmail { get; set; }
        
        public string Status { get; set; } = "Active";
    }

    public class BuyerLogisticsJobDto
    {
        public Guid Id { get; set; }
        public Guid BuyerId { get; set; }
        
        // Pickup Details
        public string PickupAddressLine1 { get; set; }
        public string PickupAddressLine2 { get; set; }
        public string PickupLandmark { get; set; }
        public string PickupCity { get; set; }
        public string PickupState { get; set; }
        public string PickupPincode { get; set; }
        
        // Drop Details
        public string DropAddressLine1 { get; set; }
        public string DropAddressLine2 { get; set; }
        public string DropLandmark { get; set; }
        public string DropCity { get; set; }
        public string DropState { get; set; }
        public string DropPincode { get; set; }
        
        // Timing & Schedule
        public DateTime PickupDate { get; set; }
        public string PickupTimeSlot { get; set; }
        public DateTime DeliveryExpectedDate { get; set; }
        public string DeliveryTimeWindow { get; set; }
        public string ShipmentPriority { get; set; }
        
        // Pallet & Load Details
        public int PalletCount { get; set; }
        public decimal TotalWeight { get; set; }
        public decimal? Length { get; set; }
        public decimal? Width { get; set; }
        public decimal? Height { get; set; }
        public string MaterialType { get; set; }
        public bool IsFragile { get; set; }
        public bool IsHighValue { get; set; }
        public string SpecialHandling { get; set; }
        
        // Documentation & Compliance
        public string EwayBillNumber { get; set; }
        public string InvoiceNumber { get; set; }
        public string GstNumber { get; set; }
        public string MaterialCategory { get; set; }
        
        // Sender Contact
        public string SenderName { get; set; }
        public string SenderCompanyName { get; set; }
        public string SenderMobile { get; set; }
        public string SenderEmail { get; set; }
        
        public List<BuyerLogisticsJobQuoteDto> Quotes { get; set; } = new List<BuyerLogisticsJobQuoteDto>();

        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // Computed properties
        public string PickupLocation { get; set; }
        public string DropLocation { get; set; }
        public decimal EstimatedWeightKg => TotalWeight; // For compatibility with frontend
    }
}
