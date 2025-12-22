using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    public class ProductRequestDto
    {
        [Required(ErrorMessage = "Product name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Product name must be between 2 and 100 characters")]
        public string Name { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Base price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero")]
        public decimal BasePrice { get; set; }

        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Location is required")]
        public string Location { get; set; }
        public string? ImageUrl { get; set; }
        public string? CertificateUrl { get; set; }

        [Required(ErrorMessage = "Category is required")]
        public string Category { get; set; }

        [Required(ErrorMessage = "Unit is required")]
        public string Unit { get; set; }

        [Required(ErrorMessage = "Minimum order quantity is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Min Order Qty must be at least 1")]
        public int MinOrderQty { get; set; }

        [Required(ErrorMessage = "Lead time is required")]
        [Range(1, 365, ErrorMessage = "Lead time must be between 1 and 365 days")]
        public int LeadTime { get; set; }

        [Required(ErrorMessage = "Status is required")]
        public string Status { get; set; }
        public Guid? SupplierId { get; set; } 
        
        public IFormFile? ImageFile { get; set; }
        public IFormFile? CertificateFile { get; set; }
    }

    public class ProductResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal BasePrice { get; set; }
        public int Quantity { get; set; }
        public string Location { get; set; }
        public string ImageUrl { get; set; }
        public string CertificateUrl { get; set; }
        public string Category { get; set; }
        public string Unit { get; set; }
        public int MinOrderQty { get; set; }
        public int LeadTime { get; set; }
        public string Status { get; set; }
        public Guid SupplierId { get; set; }
        // Flattened Supplier Name if needed
        public string SupplierName { get; set; }
        public string SupplierCompanyName { get; set; }
        public string SupplierContactPerson { get; set; }
        public string SupplierEmail { get; set; }
        public string SupplierContactNumber { get; set; }
    }
}
