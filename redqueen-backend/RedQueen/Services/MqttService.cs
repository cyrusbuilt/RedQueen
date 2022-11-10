using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Extensions.ManagedClient;
using MQTTnet.Formatter;
using MQTTnet.Protocol;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using RedQueen.Data.Models.Db;
using RedQueen.Data.Models.Dto;

namespace RedQueen.Services
{
    public interface IMqttService : IDisposable
    {
        event MqttMessageReceivedEventHandler MessageReceived;
        string Host { get; }
        bool IsDisposed { get; }
        bool AutoDiscoverEnabled { get; }
        ManagedMqttClientOptions GetOptions();
        Task StartPublisher();
        Task StopPublisher();
        Task StartSubscriber();
        Task StopSubscriber();
        Task SubscribeTopic(MqttTopic topic);
        Task SubscribeAllTopics();
        Task StartAutoDiscover();
        Task StopAutoDiscover();
        Task PublishSystemStatus(RedQueenSystemStatus status, string statusTopic);
        Task SubscribeSystemControlTopic(string controlTopic);
    }
    
    public class MqttService : IMqttService
    {
        private static Task OnPublisherConnected(MqttClientConnectedEventArgs evt)
        {
            System.Diagnostics.Debug.WriteLine("Publisher connected.");
            return Task.CompletedTask;
        }

        private static Task OnPublisherDisconnected(MqttClientDisconnectedEventArgs evt)
        {
            System.Diagnostics.Debug.WriteLine("Publisher disconnected.");
            return Task.CompletedTask;
        }

        private static Task OnSubscriberConnected(MqttClientConnectedEventArgs evt)
        {
            System.Diagnostics.Debug.WriteLine("Subscriber connected.");
            return Task.CompletedTask;
        }

        private static Task OnSubscriberDisconnected(MqttClientDisconnectedEventArgs evt)
        {
            System.Diagnostics.Debug.WriteLine("Subscriber disconnected.");
            return Task.CompletedTask;
        }

        private IManagedMqttClient _clientPublisher;
        private IManagedMqttClient _clientSubscriber;
        private readonly MqttBroker _broker;

        public event MqttMessageReceivedEventHandler MessageReceived;
        
        public bool IsDisposed { get; private set; }
        
        public string Host { get; private set; }
        
        public bool AutoDiscoverEnabled { get; private set; }

        public MqttService(MqttBroker broker)
        {
            _broker = broker;
            Host = broker.Host;
        }

        private void OnMessageReceived(MqttMessageReceivedEvent evt)
        {
            MessageReceived?.Invoke(this, evt);
        }

        private Task HandleReceivedReceivedMessage(MqttApplicationMessageReceivedEventArgs evt)
        {
            return Task.Run(() => OnMessageReceived(new MqttMessageReceivedEvent(evt, Host)));
        }

        private Task OnSubscriberMessageReceived(MqttApplicationMessageReceivedEventArgs evt)
        {
            return Task.Run(() => OnMessageReceived(new MqttMessageReceivedEvent(evt, Host)));
        }

        public ManagedMqttClientOptions GetOptions()
        {
            var keepAlive = _broker.KeepAliveSeconds ?? 5;

            var options = new ManagedMqttClientOptions
            {
                ClientOptions = new MqttClientOptions
                {
                    ClientId = "REDQUEEN",
                    ProtocolVersion = MqttProtocolVersion.V311,
                    ChannelOptions = new MqttClientTcpOptions
                    {
                        Server = _broker.Host,
                        Port = _broker.Port,
                        TlsOptions = new MqttClientTlsOptions
                        {
                            UseTls = _broker.UseTls,
                            IgnoreCertificateChainErrors = true,
                            IgnoreCertificateRevocationErrors = true,
                            AllowUntrustedCertificates = true
                        }
                    },
                    Credentials = new MqttClientCredentials(
                        _broker.Username,
                        Encoding.UTF8.GetBytes(_broker.Password)
                    ),
                    CleanSession = true,
                    KeepAlivePeriod = TimeSpan.FromSeconds(keepAlive)
                }
            };

            return options;
        }
        
        public async Task StartPublisher()
        {
            if (_clientPublisher != null)
            {
                return;
            }
            
            if (_broker == null)
            {
                throw new InvalidOperationException("MQTT Broker not defined.");
            }

            var options = GetOptions();
            if (options.ClientOptions.ChannelOptions == null)
            {
                throw new InvalidOperationException("Bad MQTT channel options");
            }
            
            var mqttFactory = new MqttFactory();
            
            _clientPublisher = mqttFactory.CreateManagedMqttClient();
            _clientPublisher.ApplicationMessageReceivedAsync += HandleReceivedReceivedMessage;
            _clientPublisher.ConnectedAsync += OnPublisherConnected;
            _clientPublisher.DisconnectedAsync += OnPublisherDisconnected;
            await _clientPublisher.StartAsync(options);
        }

        public async Task StopPublisher()
        {
            if (_clientPublisher == null)
            {
                return;
            }

            await _clientPublisher.StopAsync();
            _clientPublisher = null;
        }

        public async Task StartSubscriber()
        {
            if (_clientSubscriber != null)
            {
                return;
            }

            if (_broker == null)
            {
                throw new InvalidOperationException("MQTT Broker not defined.");
            }
            
            var options = GetOptions();
            if (options.ClientOptions.ChannelOptions == null)
            {
                throw new InvalidOperationException("Bad MQTT channel options");
            }
            
            var mqttFactory = new MqttFactory();
            _clientSubscriber = mqttFactory.CreateManagedMqttClient();
            _clientSubscriber.ConnectedAsync += OnSubscriberConnected;
            _clientSubscriber.DisconnectedAsync += OnSubscriberDisconnected;
            _clientSubscriber.ApplicationMessageReceivedAsync += OnSubscriberMessageReceived;
            await _clientSubscriber.StartAsync(options);
        }

        public async Task StopSubscriber()
        {
            if (_clientSubscriber == null)
            {
                return;
            }
            
            await _clientSubscriber.StopAsync();
            _clientSubscriber = null;
        }

        public async Task SubscribeTopic(MqttTopic topic)
        {
            if (topic.IsActive)
            {
                System.Diagnostics.Debug.WriteLine($"Subscribing topic: {topic.Name}");
                await _clientSubscriber.SubscribeAsync(topic.Name);
            }
        }

        public async Task SubscribeAllTopics()
        {
            foreach (var topic in _broker.Topics)
            {
                await SubscribeTopic(topic);
            }
        }

        public async Task StartAutoDiscover()
        {
            if (_broker == null)
            {
                throw new InvalidOperationException("MQTT Broker not defined.");
            }

            if (string.IsNullOrWhiteSpace(_broker.DiscoveryTopic))
            {
                System.Diagnostics.Debug.WriteLine("No Auto-Discover topic defined. Skipping auto-discover.");
                return;
            }

            if (AutoDiscoverEnabled)
            {
                return;
            }
            
            System.Diagnostics.Debug.WriteLine($"Discovery topic: {_broker.DiscoveryTopic}");
            
            var topic = new MqttTopic
            {
                Name = _broker.DiscoveryTopic.Trim(),
                BrokerId = _broker.Id,
                Broker = _broker,
                CreatedDate = DateTime.Now,
                IsActive = true
            };

            await SubscribeTopic(topic);
            AutoDiscoverEnabled = true;
        }

        public async Task StopAutoDiscover()
        {
            if (!AutoDiscoverEnabled || _broker == null || string.IsNullOrWhiteSpace(_broker.DiscoveryTopic))
            {
                return;
            }

            await _clientSubscriber.UnsubscribeAsync(_broker.DiscoveryTopic.Trim());
            AutoDiscoverEnabled = false;
        }

        public async Task PublishSystemStatus(RedQueenSystemStatus status, string statusTopic)
        {
            var payloadStr = JsonConvert.SerializeObject(status, new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy()
                },
                Formatting = Formatting.None
            });

            var msg = new MqttApplicationMessage
            {
                Topic = statusTopic,
                Payload = Encoding.UTF8.GetBytes(payloadStr),
                QualityOfServiceLevel = MqttQualityOfServiceLevel.AtMostOnce,
                Retain = true
            };

            await _clientPublisher.EnqueueAsync(msg);
        }

        public async Task SubscribeSystemControlTopic(string controlTopic)
        {
            var topic = new MqttTopic
            {
                Name = controlTopic,
                IsActive = true,
                Broker = _broker,
                BrokerId = _broker.Id,
                CreatedDate = DateTime.Now
            };

            await SubscribeTopic(topic);
        }
        
        public void Dispose()
        {
            if (IsDisposed)
            {
                return;
            }

            StopAutoDiscover().Wait();
            StopPublisher().Wait();
            StopSubscriber().Wait();
            IsDisposed = true;
            GC.SuppressFinalize(this);
        }
    }
}