using System;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using RedQueen.Data.Services;
using RedQueen.Data.Models.Dto;
using RedQueenAPI.Collections;
using RedQueenAPI.Models;

namespace RedQueenAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TelemetryController : ControllerBase
    {
        private readonly IRedQueenDataService _redQueenDataService;
        private readonly IConfiguration _configuration;

        public TelemetryController(IRedQueenDataService redQueenDataService, IConfiguration configuration)
        {
            _redQueenDataService = redQueenDataService;
            _configuration = configuration;
        }

        [HttpHead("brokers")]
        [HttpGet("brokers")]
        public async Task<IActionResult> GetBrokers()
        {
            var brokers = await _redQueenDataService.GetMqttBrokers(false);
            return Ok(brokers);
        }

        [HttpHead("brokers/add")]
        [HttpPost("brokers/add")]
        public async Task<IActionResult> AddBroker([FromBody] MqttBrokerDto broker)
        {
            try
            {
                var result = await _redQueenDataService.SaveBroker(broker);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new GeneralResponse
                {
                    Status = "Error",
                    Message = ex.Message
                });
            }
        }

        [HttpPut("brokers/{id:int}")]
        public async Task<IActionResult> UpdateBroker([FromRoute] int id, [FromBody] MqttBrokerDto broker)
        {
            try
            {
                var result = await _redQueenDataService.UpdateBroker(id, broker);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new GeneralResponse
                {
                    Status = "Error",
                    Message = ex.Message
                });
            }
        }

        [HttpHead("legacy/brokers/{id:int}")]
        [HttpPost("legacy/brokers/{id:int}")]
        public async Task<IActionResult> LegacyUpdateBroker([FromRoute] int id, [FromBody] MqttBrokerDto broker)
        {
            return await UpdateBroker(id, broker);
        }

        [HttpHead("brokers/{id:int}")]
        [HttpGet("brokers/{id:int}")]
        public async Task<IActionResult> GetBrokerById([FromRoute] int id)
        {
            var result = await _redQueenDataService.GetBrokerById(id);
            return Ok(result);
        }

        [HttpHead("topics")]
        [HttpGet("topics")]
        public async Task<IActionResult> GetTopics()
        {
            var result = await _redQueenDataService.GetTopics(false);
            return Ok(result);
        }

        [HttpPut("topics/{id:int}")]
        public async Task<IActionResult> UpdateTopic([FromRoute] int id, [FromBody] MqttTopicDto topic)
        {
            try
            {
                var result = await _redQueenDataService.UpdateTopic(id, topic);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new GeneralResponse
                {
                    Status = "Error",
                    Message = ex.Message
                });
            }
        }
    
        [HttpHead("legacy/topics/{id:int}")]
        [HttpPost("legacy/topics/{id:int}")]
        public async Task<IActionResult> LegacyUpdateTopic([FromRoute] int id, [FromBody] MqttTopicDto topic)
        {
            return await UpdateTopic(id, topic);
        }

        [HttpHead("topics/add")]
        [HttpPost("topics/add")]
        public async Task<IActionResult> AddTopic([FromBody] MqttTopicDto topic)
        {
            try
            {
                var success = await _redQueenDataService.SaveTopic(topic.Name, topic.BrokerId);
                if (!success)
                {
                    return BadRequest(new GeneralResponse
                    {
                        Status = "Error",
                        Message = "Could not save topic! Make sure topic does not already exist."
                    });
                }

                var savedTopic = await _redQueenDataService.GetTopic(topic.Name);
                return Ok(savedTopic);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new GeneralResponse
                {
                    Status = "Error",
                    Message = ex.Message
                });
            }
        }
        
        [HttpHead("brokers/{brokerId:int}/topics")]
        [HttpGet("brokers/{brokerId:int}/topics")]
        public async Task<IActionResult> GetTopicsForBroker([FromRoute] int brokerId)
        {
            var result = await _redQueenDataService.GetTopicsForBroker(brokerId);
            return Ok(result);
        }

        [HttpHead("messages")]
        [HttpGet("messages")]
        public async Task<IActionResult> GetMessages([FromQuery] int pageSize, [FromQuery] int currentPage)
        {
            var messages = _redQueenDataService.GetMessagesQueryable();
            var results = await PaginatedList<MqttMessageDto>.BuildPaginatedList(messages, pageSize, currentPage);
            return Ok(results);
        }

        [HttpHead("systemTelemetry")]
        [HttpGet("systemTelemetry")]
        public IActionResult GetSystemTelemetry()
        {
            var telem = new TelemetryResponse
            {
                ApiVersion = Assembly.GetEntryAssembly()?.GetName().Version?.ToString(),
                DaemonControlTopic = _configuration["MQTT:ControlTopic"],
                DaemonStatusTopic = _configuration["MQTT:StatusTopic"]
            };

            return Ok(telem);
        }
    }
}