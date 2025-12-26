using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;

namespace Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<bool> SendOtpEmailAsync(string email, string otp)
        {
            try
            {
                var smtpHost = _configuration["Email:SmtpHost"];
                var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
                var senderEmail = _configuration["Email:SenderEmail"];
                var senderName = _configuration["Email:SenderName"] ?? "TriLink";
                var appPassword = _configuration["Email:AppPassword"];

                if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(appPassword))
                {
                    _logger.LogError("Email configuration is missing");
                    return false;
                }

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(senderName, senderEmail));
                message.To.Add(new MailboxAddress("", email));
                message.Subject = "TriLink - Email Verification OTP";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset='utf-8'>
                            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                            <title>TriLink - Email Verification</title>
                        </head>
                        <body style='margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, ""Helvetica Neue"", Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;'>
                            <table width='100%' cellpadding='0' cellspacing='0' style='padding: 40px 20px;'>
                                <tr>
                                    <td align='center'>
                                        <!-- Main Container -->
                                        <table width='600' cellpadding='0' cellspacing='0' style='background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;'>
                                            <!-- Header with Logo -->
                                            <tr>
                                                <td style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;'>
                                                    <img src='{_configuration["Email:LogoUrl"] ?? "https://via.placeholder.com/150x50/667eea/ffffff?text=TriLink"}' alt='TriLink Logo' style='max-width: 150px; height: auto; margin-bottom: 15px;' />
                                                    <h1 style='margin: 0; color: white; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);'>Email Verification</h1>
                                                    <p style='margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;'>Secure your TriLink account</p>
                                                </td>
                                            </tr>
                                            
                                            <!-- Content -->
                                            <tr>
                                                <td style='padding: 40px 30px;'>
                                                    <p style='margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;'>
                                                        Hello! 👋
                                                    </p>
                                                    <p style='margin: 0 0 30px 0; color: #374151; font-size: 16px; line-height: 1.6;'>
                                                        Thank you for registering with <strong>TriLink</strong>. To complete your registration, please verify your email address using the OTP below:
                                                    </p>
                                                    
                                                    <!-- OTP Box -->
                                                    <table width='100%' cellpadding='0' cellspacing='0' style='background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 3px dashed #3b82f6; border-radius: 16px; padding: 30px; margin: 30px 0;'>
                                                        <tr>
                                                            <td align='center'>
                                                                <p style='margin: 0 0 15px 0; color: #1e40af; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;'>Your Verification Code</p>
                                                                <h2 style='margin: 0; color: #1e3a8a; font-size: 48px; font-weight: 800; letter-spacing: 12px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);'>{otp}</h2>
                                                                <p style='margin: 15px 0 0 0; color: #64748b; font-size: 14px;'>
                                                                    <svg width='16' height='16' style='vertical-align: middle; margin-right: 5px;' viewBox='0 0 24 24' fill='none' stroke='#ef4444' stroke-width='2'>
                                                                        <circle cx='12' cy='12' r='10'></circle>
                                                                        <polyline points='12 6 12 12 16 14'></polyline>
                                                                    </svg>
                                                                    Valid for <strong style='color: #ef4444;'>10 minutes</strong>
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    
                                                    <!-- Security Notice -->
                                                    <div style='background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; border-radius: 8px; margin: 30px 0;'>
                                                        <p style='margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;'>
                                                            <strong style='display: block; margin-bottom: 5px; font-size: 15px;'>🔒 Security Notice</strong>
                                                            Never share this OTP with anyone. TriLink will never ask for your OTP via phone, email, or any other medium.
                                                        </p>
                                                    </div>
                                                    
                                                    <p style='margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;'>
                                                        If you didn't request this verification code, please ignore this email or contact our support team if you have concerns.
                                                    </p>
                                                </td>
                                            </tr>
                                            
                                            <!-- Footer -->
                                            <tr>
                                                <td style='background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;'>
                                                    <p style='margin: 0 0 15px 0; color: #6b7280; font-size: 14px;'>
                                                        <strong>TriLink</strong> - Streamline your B2B procurement
                                                    </p>
                                                    <p style='margin: 0 0 10px 0; color: #9ca3af; font-size: 13px;'>
                                                        This is an automated email. Please do not reply to this message.
                                                    </p>
                                                    <p style='margin: 0; color: #d1d5db; font-size: 12px;'>
                                                        © 2025 TriLink. All rights reserved.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                    ",
                    TextBody = $@"TriLink - Email Verification

Hello!

Thank you for registering with TriLink. Your verification code is:

{otp}

This code is valid for 10 minutes.

Security Notice: Never share this OTP with anyone. TriLink will never ask for your OTP.

If you didn't request this, please ignore this email.

© 2025 TriLink. All rights reserved."
                };

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(smtpHost, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(senderEmail, appPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation($"OTP email sent successfully to {email}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to send OTP email to {email}: {ex.Message}");
                return false;
            }
        }
    }
}
