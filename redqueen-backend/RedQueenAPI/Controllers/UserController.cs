using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RedQueen.Data.Services;
using RedQueenAPI.Models;

namespace RedQueenAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUser([FromQuery] string userId)
        {
            var result = await _userService.GetUser(userId);
            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(new GeneralResponse
            {
                Status = "Error",
                Message = "User not found."
            });
        }
    }
}