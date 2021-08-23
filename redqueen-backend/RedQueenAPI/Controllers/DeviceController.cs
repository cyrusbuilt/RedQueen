using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RedQueen.Data.Services;

namespace RedQueenAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class DeviceController : ControllerBase
    {
        private readonly IRedQueenDataService _redQueenDataService;

        public DeviceController(IRedQueenDataService redQueenDataService)
        {
            _redQueenDataService = redQueenDataService;
        }

        [HttpGet]
        [Route("list")]
        public async Task<IActionResult> GetDevices()
        {
            // TODO Paginate these?
            var devices = await _redQueenDataService.GetDevices();
            return Ok(devices);
        }
    }
}