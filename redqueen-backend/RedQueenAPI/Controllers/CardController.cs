using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RedQueen.Data.Models.Db;
using RedQueen.Data.Services;
using RedQueenAPI.Collections;

namespace RedQueenAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CardController : ControllerBase
    {
        private readonly ICardService _cardService;

        public CardController(ICardService cardService)
        {
            _cardService = cardService;
        }

        [HttpHead("list")]
        [HttpGet("list")]
        public async Task<IActionResult> GetCards([FromQuery] int pageSize, [FromQuery] int currentPage)
        {
            var cardQuery = _cardService.GetCards();
            var results = await PaginatedList<Card>.BuildPaginatedList(cardQuery, pageSize, currentPage);
            return Ok(results);
        }

        [HttpHead("active-users")]
        [HttpGet("active-users")]
        public async Task<IActionResult> GetActiveUsers()
        {
            var result = await _cardService.GetActiveUsers();
            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateCard([FromBody] Card card)
        {
            var result = await _cardService.UpdateCard(card);
            return Ok(result);
        }

        [HttpHead("legacy/update")]
        [HttpPost("legacy/update")]
        public async Task<IActionResult> LegacyUpdateCard([FromBody] Card card)
        {
            return await UpdateCard(card);
        }

        [HttpHead("add")]
        [HttpPost("add")]
        public async Task<IActionResult> AddCard([FromBody] Card card)
        {
            var result = await _cardService.AddCard(card);
            return Ok(result);
        }

        [HttpHead("all-users")]
        [HttpGet("all-users")]
        public async Task<IActionResult> GetAllCardUsers([FromQuery] int pageSize, [FromQuery] int currentPage)
        {
            var userQuery = _cardService.GetCardUsers();
            var results = await PaginatedList<AccessControlUser>.BuildPaginatedList(userQuery, pageSize, currentPage);
            return Ok(results);
        }
        
        [HttpPut("user")]
        public async Task<IActionResult> UpdateCardUser([FromBody] AccessControlUser user)
        {
            var result = await _cardService.UpdateCardUser(user);
            return Ok(result);
        }

        [HttpHead("legacy/user")]
        [HttpPost("legacy/user")]
        public async Task<IActionResult> LegacyUpdateCardUser([FromBody] AccessControlUser user)
        {
            return await UpdateCardUser(user);
        }

        [HttpHead("add-user")]
        [HttpPost("add-user")]
        public async Task<IActionResult> AddCardUser([FromBody] AccessControlUser user)
        {
            var result = await _cardService.AddCardUser(user);
            return Ok(result);
        }
    }
}