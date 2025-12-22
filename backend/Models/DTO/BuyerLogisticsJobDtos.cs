using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Backend.Models.DTO
{
    public class CreateBuyerLogisticsJobDto
    {
        // Pickup Details
        [Required(ErrorMessage = "Pickup Address Line 1 is required")]
        public string PickupAddressLine1 { get; set; }
        public string PickupAddressLine2 { get; set; }
        public string PickupLandmark { get; set; }
        [Required(ErrorMessage = "Pickup City is required")]
        public string PickupCity { get; set; }
        [Required(ErrorMessage = "Pickup State is required")]
        public string PickupState { get; set; }
        [Required(ErrorMessage = "Pickup Pincode is required")]
        [RegularExpression(@"^[1-9][0-9]{5}$", ErrorMessage = "Invalid Pincode")]
        public string PickupPincode { get; set; }
        
        // Drop Details
        [Required(ErrorMessage = "Drop Address Line 1 is required")]
        public string DropAddressLine1 { get; set; }
        public string DropAddressLine2 { get; set; }
        public string DropLandmark { get; set; }
        [Required(ErrorMessage = "Drop City is required")]
        public string DropCity { get; set; }
        [Required(ErrorMessage = "Drop State is required")]
        public string DropState { get; set; }
        [Required(ErrorMessage = "Drop Pincode is required")]
        [RegularExpression(@"^[1-9][0-9]{5}$", ErrorMessage = "Invalid Pincode")]
        public string DropPincode { get; set; }
        
        // Timing & Schedule
        [Required(ErrorMessage = "Pickup Date is required")]
        public DateTime PickupDate { get; set; }
        [Required(ErrorMessage = "Pickup Time Slot is required")]
        public string PickupTimeSlot { get; set; }
        [Required(ErrorMessage = "Delivery Expected Date is required")]
        public DateTime DeliveryExpectedDate { get; set; }
        [Required(ErrorMessage = "Delivery Time Window is required")]
        public string DeliveryTimeWindow { get; set; }
        [Required(ErrorMessage = "Shipment Priority is required")]
        public string ShipmentPriority { get; set; }
        
        // Pallet & Load Details
        [Required(ErrorMessage = "Pallet Count is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Pallet count must be at least 1")]
        public int PalletCount { get; set; }
        [Required(ErrorMessage = "Total Weight is required")]
        [Range(0.1, double.MaxValue, ErrorMessage = "Total weight must be greater than 0")]
        public decimal TotalWeight { get; set; }
        public decimal? Length { get; set; }
        public decimal? Width { get; set; }
        public decimal? Height { get; set; }
        [Required(ErrorMessage = "Material Type is required")]
        public string MaterialType { get; set; }
        public bool IsFragile { get; set; }
        public bool IsHighValue { get; set; }
        public string SpecialHandling { get; set; }
        
        // Documentation & Compliance
        [Required(ErrorMessage = "Eway Bill Number is required")]
        public string EwayBillNumber { get; set; }
        [Required(ErrorMessage = "Invoice Number is required")]
        public string InvoiceNumber { get; set; }
        [Required(ErrorMessage = "GST Number is required")]
        [RegularExpression(@"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$", ErrorMessage = "Invalid GST Number format")]
        public string GstNumber { get; set; }
        [Required(ErrorMessage = "Material Category is required")]
        public string MaterialCategory { get; set; }
        
        // Sender Contact
        [Required(ErrorMessage = "Sender Name is required")]
        public string SenderName { get; set; }
        [Required(ErrorMessage = "Sender Company Name is required")]
        public string SenderCompanyName { get; set; }
        [Required(ErrorMessage = "Sender Mobile is required")]
        [Phone(ErrorMessage = "Invalid phone number")]
        public string SenderMobile { get; set; }
        [Required(ErrorMessage = "Sender Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
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
        
        // Route Planning Data
        public string? PlannedDistance { get; set; }
        public string? PlannedDuration { get; set; }
        public string? DriverExperience { get; set; }
        public string? VehicleType { get; set; }
        public string? RouteGeometry { get; set; }
        public string? OriginCoords { get; set; }
        public string? DestinationCoords { get; set; }
        public string? CostBreakdownJson { get; set; }
        
        // Computed properties
        public string PickupLocation { get; set; }
        public string DropLocation { get; set; }
        public decimal EstimatedWeightKg => TotalWeight; // For compatibility with frontend
    }
}
