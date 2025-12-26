using AutoMapper;
using Backend.Models.Domain;
using Backend.Models.DTO;
using Backend.Repositories;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenRepository _tokenRepository;
        private readonly IMapper _mapper;
        private readonly IOtpService _otpService;

        public AuthController(
            IUserRepository userRepository, 
            ITokenRepository tokenRepository, 
            IMapper mapper,
            IOtpService otpService)
        {
            _userRepository = userRepository;
            _tokenRepository = tokenRepository;
            _mapper = mapper;
            _otpService = otpService;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromForm] RegisterRequestDto registerRequestDto)
        {
            // alright let's handle the file uploads here
            if (registerRequestDto.GSTCertificateFile != null)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(registerRequestDto.GSTCertificateFile.FileName);
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                
                if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

                var filePath = Path.Combine(uploadPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await registerRequestDto.GSTCertificateFile.CopyToAsync(stream);
                }

                // ok so we're setting up the URL here
                // just storing the path for now, should work fine with static files
                var request = HttpContext.Request;
                var domain = $"{request.Scheme}://{request.Host}";
                registerRequestDto.GSTCertificateUrl = $"{domain}/uploads/{fileName}";
            }

            if (registerRequestDto.PANCardFile != null)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(registerRequestDto.PANCardFile.FileName);
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

                var filePath = Path.Combine(uploadPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await registerRequestDto.PANCardFile.CopyToAsync(stream);
                }
                
                var request = HttpContext.Request;
                var domain = $"{request.Scheme}://{request.Host}";
                registerRequestDto.PANCardUrl = $"{domain}/uploads/{fileName}";
            }

            var userDomainModel = _mapper.Map<User>(registerRequestDto);

            var user = await _userRepository.RegisterAsync(userDomainModel, registerRequestDto.Password);

            if (user == null)
            {
                return BadRequest(new { Message = "Something went wrong" });
            }

            // not sending this message anymore, logging them in directly instead

            var jwtToken = _tokenRepository.CreateJWTToken(user);

            var response = new LoginResponseDto
            {
                JwtToken = jwtToken,
                Username = user.Username,
                Role = user.Role,
                UserId = user.Id
            };

            return Ok(response);

        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequestDto)
        {
            var user = await _userRepository.AuthenticateAsync(loginRequestDto.Username, loginRequestDto.Password);

            if (user == null)
            {
                return BadRequest(new { Message = "Username or Password incorrect" });
            }

            var jwtToken = _tokenRepository.CreateJWTToken(user);

            var response = new LoginResponseDto
            {
                JwtToken = jwtToken,
                Username = user.Username,
                Role = user.Role,
                UserId = user.Id
            };

            return Ok(response);
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequestDto request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return BadRequest(new OtpResponseDto 
                    { 
                        Success = false, 
                        Message = "Email is required" 
                    });
                }

                // gotta check if this email is already taken
                var existingUser = await _userRepository.GetByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    return BadRequest(new OtpResponseDto 
                    { 
                        Success = false, 
                        Message = "Email is already registered" 
                    });
                }

                // time to generate and send the OTP
                await _otpService.GenerateOtpAsync(request.Email);

                return Ok(new OtpResponseDto 
                { 
                    Success = true, 
                    Message = "OTP sent successfully to your email",
                    ExpiresInSeconds = 600 // 10 minutes
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new OtpResponseDto 
                { 
                    Success = false, 
                    Message = ex.Message 
                });
            }
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequestDto request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Otp))
                {
                    return BadRequest(new OtpResponseDto 
                    { 
                        Success = false, 
                        Message = "Email and OTP are required" 
                    });
                }

                var isValid = await _otpService.VerifyOtpAsync(request.Email, request.Otp);

                if (isValid)
                {
                    return Ok(new OtpResponseDto 
                    { 
                        Success = true, 
                        Message = "OTP verified successfully" 
                    });
                }
                else
                {
                    return BadRequest(new OtpResponseDto 
                    { 
                        Success = false, 
                        Message = "Invalid or expired OTP. Please try again." 
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new OtpResponseDto 
                { 
                    Success = false, 
                    Message = ex.Message 
                });
            }
        }

        [HttpPost("forgot-password-otp")]
        public async Task<IActionResult> ForgotPasswordOtp([FromBody] ForgotPasswordRequestDto request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return BadRequest(new OtpResponseDto
                    {
                        Success = false,
                        Message = "Email is required"
                    });
                }

                // need to make sure email exists - opposite of registration lol
                var existingUser = await _userRepository.GetByEmailAsync(request.Email);
                if (existingUser == null)
                {
                    return BadRequest(new OtpResponseDto
                    {
                        Success = false,
                        Message = "Email not registered. Please sign up first."
                    });
                }

                // cool let's generate and send the OTP
                await _otpService.GenerateOtpAsync(request.Email);

                return Ok(new OtpResponseDto
                {
                    Success = true,
                    Message = "OTP sent successfully to your email",
                    ExpiresInSeconds = 600 // 10 minutes
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new OtpResponseDto
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email) || 
                    string.IsNullOrWhiteSpace(request.Otp) || 
                    string.IsNullOrWhiteSpace(request.NewPassword))
                {
                    return BadRequest(new OtpResponseDto
                    {
                        Success = false,
                        Message = "Email, OTP, and new password are required"
                    });
                }

                // first things first, verify the OTP
                var isOtpValid = await _otpService.VerifyOtpAsync(request.Email, request.Otp);
                if (!isOtpValid)
                {
                    return BadRequest(new OtpResponseDto
                    {
                        Success = false,
                        Message = "Invalid or expired OTP. Please try again."
                    });
                }

                // now let's update the password in database
                var passwordUpdated = await _userRepository.UpdatePasswordAsync(request.Email, request.NewPassword);
                if (!passwordUpdated)
                {
                    return BadRequest(new OtpResponseDto
                    {
                        Success = false,
                        Message = "Failed to update password. Please try again."
                    });
                }

                return Ok(new OtpResponseDto
                {
                    Success = true,
                    Message = "Password reset successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new OtpResponseDto
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }
    }
}
