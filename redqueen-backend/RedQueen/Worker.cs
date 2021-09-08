using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RedQueen.Data.Services;
using RedQueen.JsonMessages;
using RedQueen.Services;

namespace RedQueen
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IRedQueenDataService _dataService;
        private readonly IMqttServiceManager _mqttManager;

        public Worker(ILogger<Worker> logger, IServiceProvider services)
        {
            _logger = logger;
            
            var scope = services.CreateScope();
            _dataService = scope.ServiceProvider.GetRequiredService<IRedQueenDataService>();
            _mqttManager = scope.ServiceProvider.GetRequiredService<IMqttServiceManager>();
        }

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("REDQUEEN is starting up!");
            _logger.LogInformation("Loading message schemas...");
            MessageParser.LoadSchemas();
            
            _logger.LogInformation("Fetching MQTT brokers...");
            var brokers = await _dataService.GetMqttBrokers();
            
            _logger.LogInformation($"Retrieved {brokers.Count.ToString()} MQTTT brokers.");
            foreach (var x in brokers)
            {
                _logger.LogInformation($"Topic count for broker ({x.Host}): {x.Topics.ToList().Count.ToString()}");
                _mqttManager.AddService(new MqttService(x));
            }

            var result = await _mqttManager.StartAllServices();
            _logger.LogInformation($"Started {result.ToString()} MQTT service instances.");
            await base.StartAsync(cancellationToken);
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("REDQUEEN is shutting down!");
            _mqttManager.StopAllServices();
            return base.StopAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}