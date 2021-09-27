using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RedQueen.Data.Services;

namespace RedQueenAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class HistoricalDataController : ControllerBase
    {
        private readonly IHistoricalDataService _historicalDataService;

        public HistoricalDataController(IHistoricalDataService historicalDataService)
        {
            _historicalDataService = historicalDataService;
        }

        [HttpGet]
        [Route("messages")]
        public async Task<IActionResult> GetHistoricalData([FromQuery] int topicId, [FromQuery] int numDays)
        {
            var result = await _historicalDataService.GetHistoricalDataForClient(topicId, numDays);
            return Ok(result);
        }
    }
}