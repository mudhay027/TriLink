namespace Backend.Models.DTO
{
    public class OtpResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public int? ExpiresInSeconds { get; set; }
    }
}
