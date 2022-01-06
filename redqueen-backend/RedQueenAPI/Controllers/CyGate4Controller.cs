using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using RedQueen.Data.Services;
using RedQueenAPI.Models;

namespace RedQueenAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CyGate4Controller : ControllerBase
    {
        private readonly ILogger<CyGate4Controller> _logger;
        private readonly ICardService _cardService;

        public CyGate4Controller(ICardService cardService, ILogger<CyGate4Controller> logger)
        {
            _logger = logger;
            _cardService = cardService;
        }

        [Route("auth-card")]
        [HttpGet]
        public async Task<IActionResult> AuthorizeCard([FromQuery] string serial)
        {
            var response = new AccessControlResponse
            {
                Accepted = false
            };
            
            var card = await _cardService.GetCardBySerial(serial);
            if (card == null)
            {
                _logger.LogInformation($"No matching card found for serial: {serial}");
                return Ok(response);
            }

            if (!card.IsActive)
            {
                _logger.LogInformation($"Card disabled: {serial}, user: {card.User.Name}");
                return Ok(response);
            }

            if (!card.User.IsActive)
            {
                _logger.LogInformation($"User disabled: {card.User.Name}, serial: {serial}");
                return Ok(response);
            }

            response.Accepted = true;
            return Ok(response);
        }

        [Route("auth-pin")]
        [HttpGet]
        public async Task<IActionResult> AuthorizePin([FromQuery] string pin)
        {
            var response = new AccessControlResponse
            {
                Accepted = false
            };

            var user = await _cardService.GetCardUserByPin(pin);
            if (user == null)
            {
                _logger.LogInformation($"Invalid pin: {pin}");
                return Ok(response);
            }

            if (!user.IsActive)
            {
                _logger.LogInformation($"User disabled: {user.Name}, pin: {pin}");
                return Ok(response);
            }

            response.Accepted = true;
            return Ok(response);
        }
    }
}