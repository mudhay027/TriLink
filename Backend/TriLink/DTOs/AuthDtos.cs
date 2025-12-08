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
        public string Role { get; set; } = null!; // 'Buyer', 'Supplier', 'Logistics'

        public string? CompanyName { get; set; }
        public string? GstNumber { get; set; }
        public string? AddressLine1 { get; set; }
        public string? ContactPerson { get; set; } // Note: Mapped to existing fields or ignored if not in DB schema (User.cs doesn't have ContactPerson, might need adjustment or map to generic field)
        public string? ContactNumber { get; set; } // Mapped to PhoneNumber
    }

    public class LoginDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }
}
