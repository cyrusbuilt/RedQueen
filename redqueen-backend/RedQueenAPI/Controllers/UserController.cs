using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RedQueen.Data.Models.Dto;
using RedQueen.Data.Services;
using RedQueenAPI.Collections;
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

        [HttpGet]
        [Route("list")]
        public async Task<IActionResult> GetUserList()
        {
            var result = await _userService.GetUserList();
            return Ok(result);
        }

        [HttpGet]
        [Route("{id}/login-history")]
        public async Task<IActionResult> GetUserLoginHistory([FromRoute] string id, [FromQuery] int pageSize, [FromQuery] int currentPage)
        {
            var history = _userService.GetLoginHistory(id);
            var results = await PaginatedList<LoginHistoryDto>.BuildPaginatedList(history, pageSize, currentPage);
            return Ok(results);
        }
    }
}