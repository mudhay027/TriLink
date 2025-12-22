using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    public class LoginRequestDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }

    public class RegisterRequestDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long")]
        [Backend.Attributes.StrongPassword]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required(ErrorMessage = "Role is required")]
        public string Role { get; set; } // "Supplier", "Buyer", "Logistics"
        
        // New Company Information Fields
        [Required(ErrorMessage = "Company Name is required")]
        public string? CompanyName { get; set; }

        [Required(ErrorMessage = "GST Number is required")]
        [RegularExpression(@"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$", ErrorMessage = "Invalid GST Number format")]
        public string? GSTNumber { get; set; }

        [Required(ErrorMessage = "PAN Number is required")]
        [RegularExpression(@"^[A-Z]{5}[0-9]{4}[A-Z]{1}$", ErrorMessage = "Invalid PAN Number format")]
        public string? PANNumber { get; set; }

        [Required(ErrorMessage = "Contact Person is required")]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "Contact person name must contain only alphabets")]
        public string? ContactPerson { get; set; }

        [Required(ErrorMessage = "Contact Number is required")]
        [Phone(ErrorMessage = "Invalid phone number")]
        public string? ContactNumber { get; set; }

        [Required(ErrorMessage = "Address is required")]
        public string? Address { get; set; }
        public string? GSTCertificateUrl { get; set; }
        public string? PANCardUrl { get; set; }

        public Microsoft.AspNetCore.Http.IFormFile? GSTCertificateFile { get; set; }
        public Microsoft.AspNetCore.Http.IFormFile? PANCardFile { get; set; }
    }

    public class LoginResponseDto
    {
        public string JwtToken { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        // Adding UserId to support dynamic URLs
        public Guid UserId { get; set; } 
    }
}
