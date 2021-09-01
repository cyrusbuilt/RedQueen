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
    }
}