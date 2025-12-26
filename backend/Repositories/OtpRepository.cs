using Backend.Data;
using Backend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class OtpRepository : IOtpRepository
    {
        private readonly TriLinkDbContext _context;

        public OtpRepository(TriLinkDbContext context)
        {
            _context = context;
        }

        public async Task CreateOtpAsync(string email, string otp, DateTime expiresAt)
        {
            var verification = new EmailVerification
            {
                Email = email,
                OTP = otp,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = expiresAt,
                IsVerified = false,
                AttemptCount = 0
            };

            await _context.EmailVerifications.AddAsync(verification);
            await _context.SaveChangesAsync();
        }

        public async Task<EmailVerification?> GetLatestOtpAsync(string email)
        {
            return await _context.EmailVerifications
                .Where(v => v.Email == email)
                .OrderByDescending(v => v.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<int> GetRecentOtpsAsync(string email, DateTime since)
        {
            return await _context.EmailVerifications
                .Where(v => v.Email == email && v.CreatedAt >= since)
                .CountAsync();
        }

        public async Task IncrementAttemptCountAsync(int verificationId)
        {
            var verification = await _context.EmailVerifications.FindAsync(verificationId);
            if (verification != null)
            {
                verification.AttemptCount++;
                await _context.SaveChangesAsync();
            }
        }

        public async Task MarkAsVerifiedAsync(int verificationId)
        {
            var verification = await _context.EmailVerifications.FindAsync(verificationId);
            if (verification != null)
            {
                verification.IsVerified = true;
                await _context.SaveChangesAsync();
            }
        }
    }
}
