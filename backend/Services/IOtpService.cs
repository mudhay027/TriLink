namespace Backend.Services
{
    public interface IOtpService
    {
        Task<string> GenerateOtpAsync(string email);
        Task<bool> VerifyOtpAsync(string email, string otp);
        Task<bool> IsEmailVerifiedAsync(string email);
    }
}
