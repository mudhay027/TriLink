using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TriLink.Data;
using TriLink.Models;
using System.ComponentModel.DataAnnotations;

namespace TriLink.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly TriLinkDBContext _context;
        private readonly IWebHostEnvironment _environment;

        public ProductsController(TriLinkDBContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        public class ProductDto
        {
            [Required]
            public string Name { get; set; } = string.Empty;
            [Required]
            public string Category { get; set; } = string.Empty;
            [Required]
            public string Unit { get; set; } = string.Empty;
            public decimal Price { get; set; }
            public int AvailableQty { get; set; }
            public int MinOrderQty { get; set; }
            public int LeadTime { get; set; }
            public string? Description { get; set; }
            public string Status { get; set; } = "Draft";
            public IFormFile? Image { get; set; }
            public IFormFile? Document { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] ProductDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string? imagePath = null;
            if (dto.Image != null)
            {
                imagePath = await SaveFile(dto.Image, "product_images");
            }

            string? documentPath = null;
            if (dto.Document != null)
            {
                documentPath = await SaveFile(dto.Document, "product_docs");
            }

            var product = new Product
            {
                Name = dto.Name,
                Category = dto.Category,
                Unit = dto.Unit,
                Price = dto.Price,
                AvailableQty = dto.AvailableQty,
                MinOrderQty = dto.MinOrderQty,
                LeadTime = dto.LeadTime,
                Description = dto.Description,
                Status = dto.Status,
                ImagePath = imagePath,
                DocumentPath = documentPath,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Product created successfully", productId = product.Id });
        }

        private async Task<string> SaveFile(IFormFile file, string folderName)
        {
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", folderName);
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return $"uploads/{folderName}/{uniqueFileName}";
        }
    }
}
