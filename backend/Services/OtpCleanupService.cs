using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class OtpCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<OtpCleanupService> _logger;
        private readonly TimeSpan _cleanupInterval = TimeSpan.FromHours(1); // runs cleanup every hour

        public OtpCleanupService(IServiceProvider serviceProvider, ILogger<OtpCleanupService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("OTP Cleanup Service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CleanupExpiredOtpsAsync();
                    
                    // chill for a bit before next cleanup cycle
                    await Task.Delay(_cleanupInterval, stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error in OTP cleanup service: {ex.Message}");
                    // waiting a bit so we don't spam retries lol
                    await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
                }
            }

            _logger.LogInformation("OTP Cleanup Service stopped");
        }

        private async Task CleanupExpiredOtpsAsync()
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<TriLinkDbContext>();

                // cleaning up OTPs that expired more than an hour ago
                var cutoffTime = DateTime.UtcNow.AddHours(-1);
                
                var expiredOtps = await dbContext.EmailVerifications
                    .Where(v => v.ExpiresAt < cutoffTime)
                    .ToListAsync();

                if (expiredOtps.Any())
                {
                    dbContext.EmailVerifications.RemoveRange(expiredOtps);
                    await dbContext.SaveChangesAsync();
                    
                    _logger.LogInformation($"Cleaned up {expiredOtps.Count} expired OTP records");
                }
                else
                {
                    _logger.LogDebug("No expired OTPs to clean up");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error during OTP cleanup: {ex.Message}");
                throw;
            }
        }
    }
}
