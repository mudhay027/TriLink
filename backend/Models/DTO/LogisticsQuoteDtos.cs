using System;

namespace Backend.Models.DTO
{
    public class CreateQuoteDto
    {
        public Guid JobId { get; set; }
        public decimal QuoteAmount { get; set; }
        public DateTime EstimatedDeliveryDate { get; set; }
    }

    public class BuyerLogisticsJobQuoteDto
    {
        public Guid Id { get; set; }
        public Guid JobId { get; set; }
        public Guid LogisticsProviderId { get; set; }
        public string LogisticsProviderName { get; set; } // Username
        public string LogisticsProviderCompanyName { get; set; }
        public string LogisticsProviderMobile { get; set; }
        public string LogisticsProviderEmail { get; set; }
        public decimal QuoteAmount { get; set; }
        public DateTime EstimatedDeliveryDate { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // Job Details
        public string JobPickupCity { get; set; }
        public string JobDropCity { get; set; }
        public string JobStatus { get; set; }
        
        // Expanded Job Details
        public string JobPickupAddressLine1 { get; set; }
        public string JobPickupAddressLine2 { get; set; }
        public string JobPickupState { get; set; }
        public string JobPickupPincode { get; set; }
        public string JobDropAddressLine1 { get; set; }
        public string JobDropAddressLine2 { get; set; }
        public string JobDropState { get; set; }
        public string JobDropPincode { get; set; }
        public DateTime JobPickupDate { get; set; }
        public DateTime JobDeliveryExpectedDate { get; set; }
        public decimal JobTotalWeight { get; set; }
        public int JobPalletCount { get; set; }
        public string JobMaterialType { get; set; }
        public decimal? JobLength { get; set; }
        public decimal? JobWidth { get; set; }
        public decimal? JobHeight { get; set; }
        public bool JobIsFragile { get; set; }
        public bool JobIsHighValue { get; set; }
    }
}
