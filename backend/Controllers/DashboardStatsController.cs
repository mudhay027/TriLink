using Backend.Data;
using Backend.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardStatsController : ControllerBase
    {
        private readonly TriLinkDbContext _context;

        public DashboardStatsController(TriLinkDbContext context)
        {
            _context = context;
        }

        [HttpGet("supplier")]
        public async Task<IActionResult> GetSupplierStats()
        {
            var userId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);

            // Total Active Products - count products with Status = "Active" for this supplier
            var totalActiveProducts = await _context.Products
                .Where(p => p.SupplierId == userId && p.Status == "Active")
                .CountAsync();

            // Ongoing Orders - count orders that are NOT "Completed" or "Cancelled"
            var ongoingOrders = await _context.Orders
                .Where(o => o.SellerId == userId && 
                           o.Status != "Completed" && 
                           o.Status != "Cancelled")
                .CountAsync();

            // Completed Orders - count orders that are "Completed" or "Cancelled"
            var completedOrders = await _context.Orders
                .Where(o => o.SellerId == userId && 
                           (o.Status == "Completed" || o.Status == "Cancelled"))
                .CountAsync();

            var stats = new SupplierDashboardStatsDto
            {
                TotalActiveProducts = totalActiveProducts,
                OngoingOrders = ongoingOrders,
                CompletedOrders = completedOrders
            };

            return Ok(stats);
        }

        [HttpGet("buyer")]
        public async Task<IActionResult> GetBuyerStats()
        {
            var userId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);

            // Ongoing Orders - count orders that are NOT "Completed" or "Cancelled"
            var ongoingOrders = await _context.Orders
                .Where(o => o.BuyerId == userId && 
                           o.Status != "Completed" && 
                           o.Status != "Cancelled")
                .CountAsync();

            // Completed Orders - count orders that are "Completed" or "Cancelled"
            var completedOrders = await _context.Orders
                .Where(o => o.BuyerId == userId && 
                           (o.Status == "Completed" || o.Status == "Cancelled"))
                .CountAsync();

            var stats = new BuyerDashboardStatsDto
            {
                OngoingOrders = ongoingOrders,
                CompletedOrders = completedOrders
            };

            return Ok(stats);
        }
    }
}
