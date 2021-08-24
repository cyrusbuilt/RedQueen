using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RedQueen.Data.Services;
using RedQueen.Data.Models.Dto;
using RedQueenAPI.Models;

namespace RedQueenAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class TelemetryController : ControllerBase
    {
        private readonly IRedQueenDataService _redQueenDataService;

        public TelemetryController(IRedQueenDataService redQueenDataService)
        {
            _redQueenDataService = redQueenDataService;
        }

        [HttpGet]
        [Route("brokers")]
        public async Task<IActionResult> GetBrokers()
        {
            var brokers = await _redQueenDataService.GetMqttBrokers(false);
            return Ok(brokers);
        }

        [HttpPost]
        [Route("brokers/add")]
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

        [HttpPut]
        [Route("brokers/{id:int}")]
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

        [HttpGet]
        [Route("brokers/{id:int}")]
        public async Task<IActionResult> GetBrokerById([FromRoute] int id)
        {
            var result = await _redQueenDataService.GetBrokerById(id);
            return Ok(result);
        }

        [HttpGet]
        [Route("topics")]
        public async Task<IActionResult> GetTopics()
        {
            var result = await _redQueenDataService.GetTopics(false);
            return Ok(result);
        }

        [HttpPut]
        [Route("topics/{id:int}")]
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
    }
}