using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using RedQueenAPI.Authentication;
using RedQueen.Data.Models.Db;
using RedQueen.Data.Services;
using RedQueenAPI.Models;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace RedQueenAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;

        public AuthController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager,
            IConfiguration configuration, IUserService userService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _userService = userService;
        }

        [HttpPost("login")]
        [HttpHead("login")]
        public async Task<IActionResult> Login([FromBody] UserLogin login)
        {
            var user = await _userManager.FindByNameAsync(login.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, login.Password))
            {
                var lockedOut = await _userManager.IsLockedOutAsync(user);
                if (lockedOut)
                {
                    return BadRequest(new GeneralResponse
                    {
                        Status = "Error",
                        Message = "Account locked out"
                    });
                }
                
                var userRoles = await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new(ClaimTypes.Name, login.Username),
                    new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };
                
                authClaims.AddRange(userRoles.Select(userRole => new Claim(ClaimTypes.Role, userRole)));

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddHours(3),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

                await _userService.LogAccess(user.Id);
                
                return Ok(new TokenResponse
                {
                    UserId = user.Id,
                    Token = new JwtSecurityTokenHandler().WriteToken(token),
                    Expiration = token.ValidTo
                });
            }

            return Unauthorized();
        }

        [HttpPost("register")]
        [HttpHead("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistration registration)
        {
            var existingUser = await _userManager.FindByNameAsync(registration.Username);
            if (existingUser != null)
            {
                return BadRequest(new GeneralResponse
                {
                    Status = "Error",
                    Message = "User already exists!"
                });
            }

            var user = new ApplicationUser
            {
                Email = registration.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = registration.Username,
                PhoneNumber = registration.Phone
            };

            var result = await _userManager.CreateAsync(user, registration.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new GeneralResponse
                {
                    Status = "Error",
                    Message = "Failed to create user! Check user details and try again."
                });
            }

            return Ok(new GeneralResponse
            {
                Status = "Success",
                Message = "User created successfully."
            });
        }

        [HttpPost("register-admin")]
        [HttpHead("register-admin")]
        [Authorize]
        public async Task<IActionResult> RegisterAdmin([FromBody] UserRegistration registration)
        {
            var existingUser = await _userManager.FindByNameAsync(registration.Username);
            if (existingUser != null)
            {
                return BadRequest(new GeneralResponse
                {
                    Status = "Error",
                    Message = "User already exists!"
                });
            }
            
            var user = new ApplicationUser
            {
                Email = registration.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = registration.Username
            };
            
            var result = await _userManager.CreateAsync(user, registration.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new GeneralResponse
                {
                    Status = "Error",
                    Message = "Failed to create user! Check user details and try again."
                });
            }

            if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
            }

            if (!await _roleManager.RoleExistsAsync(UserRoles.User))
            {
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.User));
            }

            if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                await _userManager.AddToRoleAsync(user, UserRoles.Admin);
            }

            return Ok(new GeneralResponse
            {
                Status = "Success",
                Message = "Admin user created successfully."
            });
        }

        [HttpPut("password-reset")]
        [Authorize]
        public async Task<IActionResult> ResetPassword([FromBody] PasswordResetRequest request)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return BadRequest(new GeneralResponse
                {
                    Status = "Error",
                    Message = "User not found."
                });
            }

            var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
            if (!result.Succeeded)
            {
                foreach (var err in result.Errors)
                {
                    // TODO What to do with these errors? Tally them up and return error response?
                }
            }

            var login = new UserLogin
            {
                Username = user.UserName,
                Password = request.NewPassword
            };

            return await Login(login);
        }

        [HttpPost("legacy/password-reset")]
        [HttpHead("legacy/password-reset")]
        [Authorize]
        public async Task<IActionResult> LegacyResetPassword([FromBody] PasswordResetRequest request)
        {
            return await ResetPassword(request);
        }

        [HttpPut("disable")]
        [Authorize]
        public async Task<IActionResult> EnableLockout([FromBody] ApplicationUser appUser)
        {
            var user = await _userManager.FindByNameAsync(appUser.UserName);
            if (user == null)
            {
                return BadRequest(new GeneralResponse
                {
                    Status = "Error",
                    Message = "User does not exist."
                });
            }

            var lockoutResult = await _userManager.SetLockoutEnabledAsync(user, true);
            var endDateResult = await _userManager.SetLockoutEndDateAsync(user, new DateTime(2999, 01, 01));
            if (lockoutResult.Succeeded && endDateResult.Succeeded)
            {
                return Ok(new GeneralResponse
                {
                    Status = "Success",
                    Message = "Account locked out"
                });
            }

            return StatusCode(StatusCodes.Status500InternalServerError, new GeneralResponse
            {
                Status = "Error",
                Message = "Lockout failed. See log for details."
            });
        }

        [HttpPost("legacy/disable")]
        [HttpHead("legacy/disable")]
        [Authorize]
        public async Task<IActionResult> LegacyEnableLockout([FromBody] ApplicationUser appUser)
        {
            return await EnableLockout(appUser);
        }

        [HttpPut("enable")]
        [Authorize]
        public async Task<IActionResult> DisableLockout([FromBody] ApplicationUser appUser)
        {
            var user = await _userManager.FindByNameAsync(appUser.UserName);
            if (user == null)
            {
                return BadRequest(new GeneralResponse
                {
                    Status = "Error",
                    Message = "User does not exist."
                });
            }
           
            var endDateResult = await _userManager.SetLockoutEndDateAsync(user, null);
            var lockoutResult = await _userManager.SetLockoutEnabledAsync(user, false);
            if (lockoutResult.Succeeded && endDateResult.Succeeded)
            {
                return Ok(new GeneralResponse
                {
                    Status = "Success",
                    Message = "Account lockout removed"
                });
            }

            return StatusCode(StatusCodes.Status500InternalServerError, new GeneralResponse
            {
                Status = "Error",
                Message = "Lockout removal failed. See log for details."
            });
        }

        [HttpPost("legacy/enable")]
        [HttpHead("legacy/enable")]
        [Authorize]
        public async Task<IActionResult> LegacyDisableLockout([FromBody] ApplicationUser appUser)
        {
            return await DisableLockout(appUser);
        }
        
        [HttpPut("update")]
        [Authorize]
        public async Task<IActionResult> UpdateRegistration([FromBody] ApplicationUser appUser)
        {
            var user = await _userManager.FindByNameAsync(appUser.UserName);
            if (user == null)
            {
                return BadRequest(new GeneralResponse
                {
                    Status = "Error",
                    Message = "User does not exist."
                });
            }

            var emResult = await _userManager.SetEmailAsync(user, appUser.Email);
            var phResult = await _userManager.SetPhoneNumberAsync(user, appUser.PhoneNumber);
            if (emResult.Succeeded && phResult.Succeeded)
            {
                return Ok(new GeneralResponse
                {
                    Status = "Success",
                    Message = "Account updated."
                });
            }
            
            return StatusCode(StatusCodes.Status500InternalServerError, new GeneralResponse
            {
                Status = "Error",
                Message = "Account update failed. See log for details."
            });
        }

        [HttpPost("legacy/update")]
        [HttpHead("legacy/update")]
        [Authorize]
        public async Task<IActionResult> LegacyUpdateRegistration([FromBody] ApplicationUser appUser)
        {
            return await UpdateRegistration(appUser);
        }
    }
}