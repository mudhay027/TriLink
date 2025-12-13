using Backend.Models.Domain;

namespace Backend.Repositories
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllAsync(string? filterOn = null, string? filterQuery = null, Guid? userId = null, string? role = null);
        Task<Product?> GetByIdAsync(Guid id);
        Task<Product> CreateAsync(Product product);
        Task<Product?> UpdateAsync(Guid id, Product product);
        Task<Product?> DeleteAsync(Guid id);
    }
}
