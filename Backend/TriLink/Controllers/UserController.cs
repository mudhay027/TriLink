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
    public class UserController : ControllerBase
    {
        private readonly TriLinkDBContext _context;

        public UserController(TriLinkDBContext context)
        {
            _context = context;
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (email == null)
            {
                return Unauthorized();
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var profile = new UserProfileDto
            {
                Email = user.Email,
                Role = user.Role,
                CompanyName = user.CompanyName,
                GstNumber = user.GstNumber,
                PanNumber = user.PanNumber,
                AddressLine1 = user.AddressLine1,
                ContactPerson = user.ContactPerson,
                ContactNumber = user.PhoneNumber,
                GstCertificatePath = user.GstCertificatePath,
                PanCardPath = user.PanCardPath
            };

            return Ok(profile);
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UserProfileDto dto)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (email == null)
            {
                return Unauthorized();
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Update allowed fields
            user.CompanyName = dto.CompanyName;
            user.AddressLine1 = dto.AddressLine1;
            user.ContactPerson = dto.ContactPerson;
            user.PhoneNumber = dto.ContactNumber;

            // Save changes
            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile updated successfully" });
        }
    }
}
