using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MQTTnet;
using RedQueen.Data.Services;

namespace RedQueen.Services
{
    public interface IMqttServiceManager
    {
        List<IMqttService> Instances { get; }
        void AddService(IMqttService service);
        Task<int> StartAllServices();
        void StopAllServices();
        Task StartServiceForHost(string host);
        void StopServiceForHost(string host);
    }
    
    public class MqttServiceManager : IMqttServiceManager
    {
        private readonly ILogger<MqttServiceManager> _logger;
        private readonly IRedQueenDataService _dataService;
        
        public List<IMqttService> Instances { get; }

        public MqttServiceManager(ILogger<MqttServiceManager> logger, IServiceProvider services)
        {
            _logger = logger;

            var scope = services.CreateScope();
            _dataService = scope.ServiceProvider.GetRequiredService<IRedQueenDataService>();
            Instances = new List<IMqttService>();
        }

        private void OnMessageReceived(object sender, MqttMessageReceivedEvent evt)
        {
            var payload = evt.EventData.ApplicationMessage.ConvertPayloadToString();
            var msg = $"Message received: Timestamp: {DateTime.Now} | Topic: {evt.EventData.ApplicationMessage.Topic}";
            msg += $" | Sender: {evt.EventData.ClientId} | QoS: {evt.EventData.ApplicationMessage.QualityOfServiceLevel}";
            msg += $" | Broker: {evt.Host} | Payload: {payload}";

            _logger.LogInformation(msg);

            var broker = _dataService.GetBrokerByHost(evt.Host).Result;
            _dataService.SaveTopic(evt.EventData.ApplicationMessage.Topic, broker.Id).Wait();
            
            var topic = _dataService.GetTopic(evt.EventData.ApplicationMessage.Topic).Result;
            _dataService.SaveMqttMessage(payload, topic.Id, evt.EventData.ClientId).Wait();
        }

        public void AddService(IMqttService service)
        {
            service.MessageReceived += OnMessageReceived;
            Instances.Add(service);
        }

        public async Task<int> StartAllServices()
        {
            var count = 0;
            foreach (var instance in Instances)
            {
                _logger.LogInformation($"Starting MQTT service handler for host: {instance.Host}");
                try
                {
                    await instance.StartPublisher();
                    await instance.StartSubscriber();
                    await instance.SubscribeAllTopics();
                    count++;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Failed to start publisher and/or subscriber for host: {instance.Host}: {ex.Message}");
                }

                try
                {
                    _logger.LogInformation($"Attempting to start auto-discover for host: {instance.Host}");
                    await instance.StartAutoDiscover();
                    if (instance.AutoDiscoverEnabled)
                    {
                        _logger.LogInformation("Auto-discover running.");
                    }
                    else
                    {
                        _logger.LogWarning("Auto-discover already running or topic not defined.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Failed to start auto-discover for host: {instance.Host}: {ex.Message}");
                }
            }

            return count;
        }

        public void StopAllServices()
        {
            foreach (var instance in Instances)
            {
                _logger.LogInformation($"Stopping MQTT service handler for host: {instance.Host}");
                instance.Dispose();
            }
        }

        public async Task StartServiceForHost(string host)
        {
            var svc = Instances.FirstOrDefault(s => s.Host.ToLower().Equals(host.ToLower()));
            if (svc != null)
            {
                try
                {
                    _logger.LogInformation($"Starting MQTT service handler for host: {svc.Host}");
                    await svc.StartPublisher();
                    await svc.StopPublisher();
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Failed to start publisher and/or subscriber for host: {svc.Host}: {ex.Message}");
                }
            }
        }

        public void StopServiceForHost(string host)
        {
            var svc = Instances.FirstOrDefault(s => s.Host.ToLower().Equals(host.ToLower()));
            if (svc != null)
            {
                _logger.LogInformation($"Stopping MQTT service handler for host: {svc.Host}");
                svc.Dispose();
            }
        }
    }
}