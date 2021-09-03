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

        [HttpGet]
        [Route("list")]
        public async Task<IActionResult> GetCards([FromQuery] int pageSize, [FromQuery] int currentPage)
        {
            var cardQuery = _cardService.GetCards();
            var results = await PaginatedList<Card>.BuildPaginatedList(cardQuery, pageSize, currentPage);
            return Ok(results);
        }

        [HttpGet]
        [Route("active-users")]
        public async Task<IActionResult> GetActiveUsers()
        {
            var result = await _cardService.GetActiveUsers();
            return Ok(result);
        }

        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> UpdateCard([FromBody] Card card)
        {
            var result = await _cardService.UpdateCard(card);
            return Ok(result);
        }

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> AddCard([FromBody] Card card)
        {
            var result = await _cardService.AddCard(card);
            return Ok(result);
        }

        [HttpGet]
        [Route("all-users")]
        public async Task<IActionResult> GetAllCardUsers([FromQuery] int pageSize, [FromQuery] int currentPage)
        {
            var userQuery = _cardService.GetCardUsers();
            var results = await PaginatedList<AccessControlUser>.BuildPaginatedList(userQuery, pageSize, currentPage);
            return Ok(results);
        }

        [HttpPut]
        [Route("user")]
        public async Task<IActionResult> UpdateCardUser([FromBody] AccessControlUser user)
        {
            var result = await _cardService.UpdateCardUser(user);
            return Ok(result);
        }

        [HttpPost]
        [Route("add-user")]
        public async Task<IActionResult> AddCardUser([FromBody] AccessControlUser user)
        {
            var result = await _cardService.AddCardUser(user);
            return Ok(result);
        }
        
        
    }
}