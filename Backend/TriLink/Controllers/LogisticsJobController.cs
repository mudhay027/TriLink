using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TriLink.Data;
using TriLink.DTOs;
using TriLink.Models;

namespace TriLink.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogisticsJobController : ControllerBase
    {
        private readonly TriLinkDBContext _context;

        public LogisticsJobController(TriLinkDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMyJobs()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            
            // Allow Supplier to see their created jobs
            // Allow Logistics to see all 'Active' jobs (logic for available-jobs page)
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (role == "Logistics")
            {
                var jobs = await _context.LogisticsJobs
                    .Where(j => j.Status == "Active")
                    .OrderByDescending(j => j.CreatedAt)
                    .Select(j => new LogisticsJobDto
                    {
                        Id = j.Id,
                        OrderId = j.OrderId,
                        PickupLocation = $"{j.PickupCity}, {j.PickupState}",
                        DropLocation = $"{j.DropCity}, {j.DropState}",
                        EstimatedWeightKg = j.EstimatedWeightKg,
                        Status = j.Status,
                        CreatedAt = j.CreatedAt
                    })
                    .ToListAsync();
                return Ok(jobs);
            }
            else // Supplier (or Buyer)
            {
                var jobs = await _context.LogisticsJobs
                    .Where(j => j.CreatedByUserId == userId)
                    .OrderByDescending(j => j.CreatedAt)
                    .Select(j => new LogisticsJobDto
                    {
                        Id = j.Id,
                        OrderId = j.OrderId,
                        PickupLocation = $"{j.PickupCity}, {j.PickupState}",
                        DropLocation = $"{j.DropCity}, {j.DropState}",
                        EstimatedWeightKg = j.EstimatedWeightKg,
                        Status = j.Status,
                        CreatedAt = j.CreatedAt
                    })
                    .ToListAsync();
                return Ok(jobs);
            }
        }

        [HttpPost]
        [Authorize(Roles = "Supplier")]
        public async Task<IActionResult> CreateJob([FromBody] CreateLogisticsJobDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var job = new LogisticsJob
            {
                OrderId = dto.OrderId,
                PickupAddressLine1 = dto.PickupAddressLine1,
                PickupAddressLine2 = dto.PickupAddressLine2,
                PickupCity = dto.PickupCity,
                PickupState = dto.PickupState,
                PickupPincode = dto.PickupPincode,
                PickupCountry = "India",
                DropAddressLine1 = dto.DropAddressLine1,
                DropAddressLine2 = dto.DropAddressLine2,
                DropCity = dto.DropCity,
                DropState = dto.DropState,
                DropPincode = dto.DropPincode,
                DropCountry = "India",
                EstimatedWeightKg = dto.EstimatedWeightKg,
                Status = dto.Status,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.LogisticsJobs.Add(job);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Logistics Job Created Successfully", jobId = job.Id });
        }
    }
}
