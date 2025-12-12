using Backend.Data;
using Backend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly TriLinkDbContext _context;

        public ProductRepository(TriLinkDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllAsync(string? filterOn = null, string? filterQuery = null, Guid? userId = null, string? role = null)
        {
            var products = _context.Products.Include(p => p.Supplier).AsQueryable();

            // Filter by Supplier if the user is a Supplier requesting their own products
            // Note: If a Buyer is browsing, we show all (or filter by generic search)
            if (userId.HasValue && !string.IsNullOrEmpty(role) && role.Equals("Supplier", StringComparison.OrdinalIgnoreCase))
            {
                products = products.Where(p => p.SupplierId == userId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filterOn) && !string.IsNullOrWhiteSpace(filterQuery))
            {
                if (filterOn.Equals("Name", StringComparison.OrdinalIgnoreCase))
                {
                    products = products.Where(x => x.Name.Contains(filterQuery));
                }
                 else if (filterOn.Equals("Location", StringComparison.OrdinalIgnoreCase))
                {
                     products = products.Where(x => x.Location.Contains(filterQuery));
                }
            }

            return await products.ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(Guid id)
        {
            return await _context.Products.Include(p => p.Supplier).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Product> CreateAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product?> UpdateAsync(Guid id, Product product)
        {
            var existingProduct = await _context.Products.FirstOrDefaultAsync(x => x.Id == id);

            if (existingProduct == null)
            {
                return null;
            }

            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.BasePrice = product.BasePrice;
            existingProduct.Quantity = product.Quantity;
            existingProduct.Location = product.Location;
            if (product.ImageUrl != null) existingProduct.ImageUrl = product.ImageUrl;
            
            // New Fields
            existingProduct.Category = product.Category;
            existingProduct.Unit = product.Unit;
            existingProduct.MinOrderQty = product.MinOrderQty;
            existingProduct.LeadTime = product.LeadTime;
            existingProduct.Status = product.Status;
            if (product.CertificateUrl != null) existingProduct.CertificateUrl = product.CertificateUrl;
            
            await _context.SaveChangesAsync();
            return existingProduct;
        }

        public async Task<Product?> DeleteAsync(Guid id)
        {
            var existingProduct = await _context.Products.FirstOrDefaultAsync(x => x.Id == id);

            if (existingProduct == null)
            {
                return null;
            }

            _context.Products.Remove(existingProduct);
            await _context.SaveChangesAsync();
            return existingProduct;
        }
    }
}
