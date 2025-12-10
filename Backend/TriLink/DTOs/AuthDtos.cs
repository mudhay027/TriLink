using System.ComponentModel.DataAnnotations;

namespace TriLink.DTOs
{
    public class RegisterDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required, MinLength(6)]
        public string Password { get; set; } = null!;

        [Required]
        public string Role { get; set; } = null!;

        public string? CompanyName { get; set; }
        public string? GstNumber { get; set; }
        public string? PanNumber { get; set; }
        public string? AddressLine1 { get; set; }
        public string? ContactPerson { get; set; } 
        public string? ContactNumber { get; set; } 

        public IFormFile? GstCertificate { get; set; }
        public IFormFile? PanCard { get; set; }
    }

    public class LoginDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }

    public class UserProfileDto
    {
        public string? CompanyName { get; set; }
        public string? AddressLine1 { get; set; }
        public string? ContactPerson { get; set; }
        public string? ContactNumber { get; set; } // Phone
        
        // Read-only fields
        public string? Email { get; set; }
        public string? GstNumber { get; set; }
        public string? PanNumber { get; set; }
        public string? Role { get; set; }
        
        // Document paths
        public string? GstCertificatePath { get; set; }
        public string? PanCardPath { get; set; }
    }
}
