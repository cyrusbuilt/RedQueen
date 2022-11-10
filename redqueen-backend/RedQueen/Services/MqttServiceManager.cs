using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MQTTnet;
using RedQueen.Data.Models;
using RedQueen.Data.Models.Db;
using RedQueen.Data.Models.Dto;
using RedQueen.Data.Services;
using RedQueen.JsonMessages;
using RedQueen.Telemetry;

namespace RedQueen.Services
{
    public interface IMqttServiceManager
    {
        List<IMqttService> Instances { get; }
        bool ShouldStop { get; }
        bool ShouldRestart { get; }
        SystemStatus SystemStatus { get; }
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
        private readonly IConfiguration _configuration;

        public List<IMqttService> Instances { get; }
        
        public bool ShouldStop { get; private set; }
        
        public bool ShouldRestart { get; private set; }
        
        public SystemStatus SystemStatus { get; private set; }

        public MqttServiceManager(ILogger<MqttServiceManager> logger, IServiceProvider services, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;

            var scope = services.CreateScope();
            _dataService = scope.ServiceProvider.GetRequiredService<IRedQueenDataService>();
            Instances = new List<IMqttService>();
        }

        private static bool IsDiscoveryTopic(MqttBroker broker, string topicName)
        {
            return !string.IsNullOrWhiteSpace(broker.DiscoveryTopic)
                   && topicName.ToLower().Contains(broker.DiscoveryTopic.ToLower());
        }

        private bool IsControlTopic(string topicName)
        {
            return !string.IsNullOrWhiteSpace(topicName)
                   && !string.IsNullOrWhiteSpace(_configuration["MQTT:ControlTopic"])
                   && _configuration["MQTT:ControlTopic"].ToLower().Equals(topicName.ToLower());
        }

        private void ProcessDeviceDiscovery(MqttBroker broker, string payload)
        {
            // Device discovery process:
            // A device announces itself to the discovery topic and sends a config payload (see
            // autoDiscoverConfigSchema.json) and if the payload validates properly, then the first thing to happen
            // is to fetch the status topic (required. auto-create if not exist) and the control topic (if specified,
            // and auto-create if not exist), then create the device if it doesn't already exist. If device did not
            // already exist, and was successfully created, then subscribe to the status topic.
            
            var device = MessageParser.ParseDevice(payload, out var messages);
            if (device == null)
            {
                foreach (var errMsg in messages)
                {
                    _logger.LogError($"Failed to parse JSON payload: {errMsg}");
                }
            }
            else
            {
                _logger.LogInformation($"Discovered device {device.Name}!");
                _logger.LogInformation($"Attempting to save config for device: {device.Name}");
                var statTopic = _dataService.GetTopic(device.StatusTopic).Result;
                if (statTopic == null)
                {
                    _logger.LogWarning($"Status topic not found: {device.StatusTopic}. Adding...");
                    _dataService.SaveTopic(device.StatusTopic, broker.Id).Wait();
                }

                MqttTopic contTopic = null;
                if (!string.IsNullOrWhiteSpace(device.ControlTopic))
                {
                    contTopic = _dataService.GetTopic(device.ControlTopic).Result;
                    if (contTopic == null)
                    {
                        _logger.LogWarning($"Control topic not found: {device.ControlTopic}. Adding...");
                        _dataService.SaveTopic(device.ControlTopic, broker.Id).Wait();
                        contTopic = _dataService.GetTopic(device.ControlTopic).Result;
                    }
                }

                statTopic = _dataService.GetTopic(device.StatusTopic).Result;
                if (statTopic == null)
                {
                    _logger.LogError($"Unable to fetch or save status topic. Cannot save device.");
                    return;
                }

                if (!DeviceClass.All.Contains(device.Class.ToLower()))
                {
                    _logger.LogError($"Illegal device class: '{device.Class}'. Ignoring device.");
                    return;
                }
                    
                var newDev = new DeviceDto
                {
                    Name = device.Name,
                    Class = device.Class,
                    StatusTopicId = statTopic.Id,
                    ControlTopicId = contTopic?.Id
                };
                    
                var result = _dataService.AddDevice(newDev).Result;
                if (result == null)
                {
                    _logger.LogWarning($"Config for device already exists: {device.Name}");
                }
                else
                {
                    _logger.LogInformation("Device saved!");
                    var serviceInstance = Instances.First(h => h.Host.Equals(broker.Host));
                    serviceInstance.SubscribeTopic(statTopic).Wait();
                }
            }
        }

        private async Task PublishStatus(IMqttService service)
        {
            var stat = new RedQueenSystemStatus
            {
                Timestamp = DateTime.Now,
                Status = (int)SystemStatus,
                DaemonVersion = Assembly.GetEntryAssembly()?.GetName().Version?.ToString()
            };

            var topic = _configuration["MQTT:StatusTopic"];
            await service.PublishSystemStatus(stat, topic);
        }

        private async Task ProcessControlMessage(string payload, IMqttService service)
        {
            var cmd = MessageParser.ParseControlCommand(payload, out var messages);
            if (cmd == null)
            {
                foreach (var errMsg in messages)
                {
                    _logger.LogError($"Failed to parse JSON payload: {errMsg}");
                }
            }
            else
            {
                _logger.LogInformation($"Received command from {cmd.Sender}: {cmd.Command.ToString()}");
                switch (cmd.Command)
                {
                    case (int)ControlCommand.Restart:
                        _logger.LogWarning("Restarting services...");
                        SystemStatus = SystemStatus.Restart;
                        ShouldRestart = true;
                        await PublishStatus(service);
                        break;
                    case (int)ControlCommand.Shutdown:
                        _logger.LogWarning("**** REDQUEEN SHUTTING DOWN ****");
                        SystemStatus = SystemStatus.Shutdown;
                        ShouldStop = true;
                        await PublishStatus(service);
                        break;
                    default:
                        break;
                }
            }
        }

        private void OnMessageReceived(object sender, MqttMessageReceivedEvent evt)
        {
            var payload = evt.EventData.ApplicationMessage.ConvertPayloadToString();
            var topicName = evt.EventData.ApplicationMessage.Topic;
            
            var msg = $"Message received: Timestamp: {DateTime.Now} | Topic: {evt.EventData.ApplicationMessage.Topic}";
            msg += $" | QoS: {evt.EventData.ApplicationMessage.QualityOfServiceLevel}";
            msg += $" | Broker: {evt.Host} | Payload: {payload}";

            _logger.LogInformation(msg);

            // If we got a message on the discovery topic, then process the discovered device. Otherwise, save the
            // payload as a message in the DB.
            var broker = _dataService.GetBrokerByHost(evt.Host).GetAwaiter().GetResult();
            if (IsDiscoveryTopic(broker, topicName))
            {
                ProcessDeviceDiscovery(broker, payload);
            }

            if (IsControlTopic(topicName))
            {
                ProcessControlMessage(payload, (MqttService)sender).Wait();
            }
            
            _dataService.SaveTopic(topicName, broker.Id).Wait();
            
            var topic = _dataService.GetTopic(topicName).GetAwaiter().GetResult();
            _dataService.SaveMqttMessage(payload, topic.Id, evt.EventData.ClientId).Wait();
        }

        public void AddService(IMqttService service)
        {
            service.MessageReceived += OnMessageReceived;
            Instances.Add(service);
        }

        public async Task<int> StartAllServices()
        {
            SystemStatus = SystemStatus.Normal;
            var count = 0;
            foreach (var instance in Instances)
            {
                _logger.LogInformation($"Starting MQTT service handler for host: {instance.Host}");
                try
                {
                    await instance.StartPublisher();
                    await instance.StartSubscriber();
                    await instance.SubscribeAllTopics();
                    await instance.SubscribeSystemControlTopic(_configuration["MQTT:ControlTopic"]);
                    await PublishStatus(instance);
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

            ShouldRestart = false;
            SystemStatus = SystemStatus.Shutdown;
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