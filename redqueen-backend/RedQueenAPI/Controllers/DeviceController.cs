using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RedQueen.Data.Models;
using RedQueen.Data.Models.Db;
using RedQueen.Data.Models.Dto;
using RedQueen.Data.Services;
using RedQueenAPI.Collections;
using RedQueenAPI.Models;

namespace RedQueenAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DeviceController : ControllerBase
    {
        private readonly IRedQueenDataService _redQueenDataService;

        public DeviceController(IRedQueenDataService redQueenDataService)
        {
            _redQueenDataService = redQueenDataService;
        }
        
        [HttpHead("list")]
        [HttpGet("list")]
        public async Task<IActionResult> GetDevices()
        {
            var devices = await _redQueenDataService.GetDevices(false);
            return Ok(devices);
        }

        [HttpHead("list/paginated")]
        [HttpGet("list/paginated")]
        public async Task<IActionResult> GetDevices([FromQuery] int pageSize, [FromQuery] int currentPage)
        {
            var devices = _redQueenDataService.GetDevicesQueryable(false);
            var results = await PaginatedList<Device>.BuildPaginatedList(devices, pageSize, currentPage);
            return Ok(results);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateDevice([FromRoute] int id, [FromBody] DeviceDto device)
        {
            try
            {
                var dev = await _redQueenDataService.UpdateDevice(id, device);
                return Ok(dev);
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

        [HttpHead("legacy/{id:int}")]
        [HttpPost("legacy/{id:int}")]
        public async Task<IActionResult> LegacyUpdateDevice([FromRoute] int id, [FromBody] DeviceDto device)
        {
            return await UpdateDevice(id, device);
        }

        [HttpHead("add")]
        [HttpPost("add")]
        public async Task<IActionResult> AddDevice([FromBody] DeviceDto device)
        {
            try
            {
                var result = await _redQueenDataService.AddDevice(device);
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

        [HttpHead("classes")]
        [HttpGet("classes")]
        public IActionResult GetDeviceClasses()
        {
            return Ok(DeviceClass.All);
        }
    }
}