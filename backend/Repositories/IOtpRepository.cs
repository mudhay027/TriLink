using Backend.Models.Domain;

namespace Backend.Repositories
{
    public interface IOtpRepository
    {
        Task CreateOtpAsync(string email, string otp, DateTime expiresAt);
        Task<EmailVerification?> GetLatestOtpAsync(string email);
        Task<int> GetRecentOtpsAsync(string email, DateTime since);
        Task IncrementAttemptCountAsync(int verificationId);
        Task MarkAsVerifiedAsync(int verificationId);
    }
}
