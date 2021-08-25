using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RedQueen.Data.Models.Db;
using RedQueen.Data.Services;
using RedQueen.Data.Models.Dto;
using RedQueenAPI.Collections;
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

        [HttpPost]
        [Route("topics/add")]
        public async Task<IActionResult> AddTopic([FromBody] MqttTopicDto topic)
        {
            try
            {
                var success = await _redQueenDataService.SaveTopic(topic.Name, topic.BrokerId);
                if (success)
                {
                    var savedTopic = await _redQueenDataService.GetTopic(topic.Name);
                    return Ok(savedTopic);
                }
                else
                {
                    return BadRequest(new GeneralResponse
                    {
                        Status = "Error",
                        Message = "Could not save topic! Make sure topic does not already exist."
                    });
                }
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
        [Route("brokers/{brokerId:int}/topics")]
        public async Task<IActionResult> GetTopicsForBroker([FromRoute] int brokerId)
        {
            var result = await _redQueenDataService.GetTopicsForBroker(brokerId);
            return Ok(result);
        }

        [HttpGet]
        [Route("messages")]
        public async Task<IActionResult> GetMessages([FromQuery] int pageSize, [FromQuery] int currentPage)
        {
            var messages = _redQueenDataService.GetMessagesQueryable();
            var results = await PaginatedList<MqttMessageDto>.BuildPaginatedList(messages, pageSize, currentPage);
            return Ok(results);
        }
    }
}