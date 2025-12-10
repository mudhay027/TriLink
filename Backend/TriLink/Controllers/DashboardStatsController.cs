using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TriLink.Data;
using TriLink.DTOs;

namespace TriLink.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardStatsController : ControllerBase
    {
        private readonly TriLinkDBContext _context;

        public DashboardStatsController(TriLinkDBContext context)
        {
            _context = context;
        }

        [HttpGet("supplier")]
        public async Task<ActionResult<SupplierDashboardStatsDto>> GetSupplierStats()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized("User ID claim not found");

                if (!int.TryParse(userIdClaim.Value, out int userId))
                    return Unauthorized("Invalid User ID format");

                // Get Total Active Products
                var activeProductsCount = await _context.Products
                    .CountAsync(p => p.SupplierId == userId && p.IsActive);

                // Get Ongoing Orders (Pending, Accepted, Dispatched, LogisticsAssigned, Picked, InTransit, Negotiation)
                // Exclude: Delivered, Closed, Cancelled, Rejected
                var ongoingOrdersCount = await _context.Orders
                    .CountAsync(o => o.SupplierId == userId && 
                        o.Status != "Delivered" && 
                        o.Status != "Closed" && 
                        o.Status != "Cancelled" &&
                        o.Status != "Rejected");

                // Get Completed Orders (Delivered, Closed)
                var completedOrdersCount = await _context.Orders
                    .CountAsync(o => o.SupplierId == userId && 
                        (o.Status == "Delivered" || o.Status == "Closed"));

                return Ok(new SupplierDashboardStatsDto
                {
                    TotalActiveProducts = activeProductsCount,
                    OngoingOrders = ongoingOrdersCount,
                    CompletedOrders = completedOrdersCount
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
