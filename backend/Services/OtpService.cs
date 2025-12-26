using Backend.Repositories;
using Microsoft.Extensions.Configuration;

namespace Backend.Services
{
    public class OtpService : IOtpService
    {
        private readonly IOtpRepository _otpRepository;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<OtpService> _logger;

        public OtpService(
            IOtpRepository otpRepository,
            IEmailService emailService,
            IConfiguration configuration,
            ILogger<OtpService> logger)
        {
            _otpRepository = otpRepository;
            _emailService = emailService;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<string> GenerateOtpAsync(string email)
        {
            try
            {
                // Check rate limiting
                var rateLimitPerHour = int.Parse(_configuration["Otp:RateLimitPerHour"] ?? "3");
                var recentOtps = await _otpRepository.GetRecentOtpsAsync(email, DateTime.UtcNow.AddHours(-1));
                
                if (recentOtps >= rateLimitPerHour)
                {
                    throw new Exception($"Rate limit exceeded. Maximum {rateLimitPerHour} OTP requests per hour.");
                }

                // Generate 6-digit OTP
                var random = new Random();
                var otp = random.Next(100000, 999999).ToString();

                // Get expiry time from configuration
                var expiryMinutes = int.Parse(_configuration["Otp:ExpiryMinutes"] ?? "10");
                var expiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes);

                // Save OTP to database
                await _otpRepository.CreateOtpAsync(email, otp, expiresAt);

                // Send OTP via email
                var emailSent = await _emailService.SendOtpEmailAsync(email, otp);
                
                if (!emailSent)
                {
                    throw new Exception("Failed to send OTP email");
                }

                _logger.LogInformation($"OTP generated and sent to {email}");
                return otp;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error generating OTP for {email}: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> VerifyOtpAsync(string email, string otp)
        {
            try
            {
                var verification = await _otpRepository.GetLatestOtpAsync(email);

                if (verification == null)
                {
                    _logger.LogWarning($"No OTP found for email: {email}");
                    return false;
                }

                // Check if already verified
                if (verification.IsVerified)
                {
                    _logger.LogWarning($"OTP already verified for email: {email}");
                    return true;
                }

                // Check if expired
                if (DateTime.UtcNow > verification.ExpiresAt)
                {
                    _logger.LogWarning($"OTP expired for email: {email}");
                    return false;
                }

                // Check max attempts
                var maxAttempts = int.Parse(_configuration["Otp:MaxAttempts"] ?? "3");
                if (verification.AttemptCount >= maxAttempts)
                {
                    _logger.LogWarning($"Max OTP verification attempts exceeded for email: {email}");
                    return false;
                }

                // Increment attempt count
                await _otpRepository.IncrementAttemptCountAsync(verification.Id);

                // Verify OTP
                if (verification.OTP != otp)
                {
                    _logger.LogWarning($"Invalid OTP for email: {email}");
                    return false;
                }

                // Mark as verified
                await _otpRepository.MarkAsVerifiedAsync(verification.Id);
                _logger.LogInformation($"OTP verified successfully for email: {email}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error verifying OTP for {email}: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> IsEmailVerifiedAsync(string email)
        {
            try
            {
                var verification = await _otpRepository.GetLatestOtpAsync(email);
                return verification != null && verification.IsVerified;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error checking email verification status for {email}: {ex.Message}");
                return false;
            }
        }
    }
}
