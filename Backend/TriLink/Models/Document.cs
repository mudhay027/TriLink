using System.ComponentModel.DataAnnotations;

namespace TriLink.Models
{
    public class Document
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        [Required, MaxLength(20)]
        public string DocumentType { get; set; } = null!; // Invoice / Challan

        [Required, MaxLength(50)]
        public string DocumentNumber { get; set; } = null!;

        [Required, MaxLength(500)]
        public string FileUrl { get; set; } = null!; // Blob/S3 URL

        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    }
}
