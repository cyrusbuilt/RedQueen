using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RedQueen.Data.Models.Db;
using RedQueen.Data.Models.Dto;

namespace RedQueen.Data.Services
{
    public interface IRedQueenDataService
    {
        Task<List<MqttBroker>> GetMqttBrokers(bool activeOnly = true);
        Task<MqttBroker> GetBrokerByHost(string host);
        Task<MqttBroker> GetBrokerById(int id);
        Task<bool> TopicExists(string topic);
        Task<MqttTopic> GetTopic(string topic);
        Task<List<MqttTopic>> GetTopicsForBroker(int brokerId);
        Task<bool> SaveTopic(string topicName, int brokerId);
        Task<MqttTopic> UpdateTopic(int id, MqttTopicDto topic);
        Task SaveMqttMessage(string message, int topicId, string clientId);
        Task<List<Device>> GetDevices(bool activeOnly = true);
        IQueryable<Device> GetDevicesQueryable(bool activeOnly = true);
        Task<MqttBroker> SaveBroker(MqttBrokerDto broker);
        Task<MqttBroker> UpdateBroker(int id, MqttBrokerDto broker);
        Task<List<MqttTopic>> GetTopics(bool activeOnly = true);
        Task<Device> UpdateDevice(int id, DeviceDto device);
        Task<Device> AddDevice(DeviceDto device);
        Task<List<MqttMessage>> GetMessages();
        IQueryable<MqttMessageDto> GetMessagesQueryable();
    }
    
    public class RedQueenDataService : IRedQueenDataService
    {
        private readonly RedQueenContext _context;

        public RedQueenDataService(IServiceProvider services)
        {
            var scope = services.CreateScope();
            _context = scope.ServiceProvider.GetRequiredService<RedQueenContext>();
        }

        public async Task<List<MqttBroker>> GetMqttBrokers(bool activeOnly)
        {
            var brokers = activeOnly
                ? await _context.Brokers.Where(b => b.IsActive).ToListAsync()
                : await _context.Brokers.ToListAsync();
            
            foreach (var b in brokers)
            {
                var topics = from topic in _context.Topics
                    where topic.BrokerId == b.Id
                    select topic;
                b.Topics = await topics.ToListAsync();
            }

            return brokers;
        }

        public async Task<MqttBroker> GetBrokerByHost(string host)
        {
            return await _context.Brokers.FirstOrDefaultAsync(
                x => x.IsActive && x.Host.ToLower().Equals(host.ToLower()));
        }

        public async Task<bool> TopicExists(string topic)
        {
            return await _context.Topics.AnyAsync(t => t.Name.ToLower().Equals(topic.ToLower()));
        }

        public async Task<MqttTopic> GetTopic(string topic)
        {
            return await _context.Topics.Where(t => t.Name.Equals(topic)).FirstOrDefaultAsync();
        }

        public async Task<List<MqttTopic>> GetTopicsForBroker(int brokerId)
        {
            return await _context.Topics.Where(t => t.BrokerId == brokerId).ToListAsync();
        }

        public async Task<bool> SaveTopic(string topicName, int brokerId)
        {
            var exists = await TopicExists(topicName);
            if (exists) return false;
            
            _context.Topics.Add(new MqttTopic
            {
                Name = topicName,
                CreatedDate = DateTime.Now,
                BrokerId = brokerId,
                IsActive = true
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task SaveMqttMessage(string message, int topicId, string clientId)
        {
            _context.Messages.Add(new MqttMessage
            {
                Content = message,
                TopicId = topicId,
                ClientId = clientId,
                Timestamp = DateTime.Now
            });

            await _context.SaveChangesAsync();
        }

        public async Task<List<Device>> GetDevices(bool activeOnly)
        {
            var devices = activeOnly
                ? await _context.Devices.Where(d => d.IsActive).ToListAsync()
                : await _context.Devices.ToListAsync();
            
            foreach (var device in devices)
            {
                device.StatusTopic = await _context.Topics.FirstOrDefaultAsync(t => t.Id == device.StatusTopicId);
                device.ControlTopic = await _context.Topics.FirstOrDefaultAsync(t => t.Id == device.ControlTopicId);
            }

            return devices;
        }

        public IQueryable<Device> GetDevicesQueryable(bool activeOnly)
        {
            var query = from d in _context.Devices
                join t in _context.Topics on d.StatusTopicId equals t.Id
                join t2 in _context.Topics on d.ControlTopicId equals t2.Id
                select new Device
                {
                    Id = d.Id,
                    Class = d.Class,
                    ControlTopic = t2,
                    ControlTopicId = t2.Id,
                    CreatedDate = d.CreatedDate,
                    IsActive = d.IsActive,
                    ModifiedDate = d.ModifiedDate,
                    Name = d.Name,
                    StatusTopic = t,
                    StatusTopicId = t.Id
                };
            if (activeOnly)
            {
                query = from d in _context.Devices
                    join t in _context.Topics on d.StatusTopicId equals t.Id
                    join t2 in _context.Topics on d.ControlTopicId equals t2.Id
                    where d.IsActive
                    select new Device
                    {
                        Id = d.Id,
                        Class = d.Class,
                        ControlTopic = t2,
                        ControlTopicId = t2.Id,
                        CreatedDate = d.CreatedDate,
                        IsActive = d.IsActive,
                        ModifiedDate = d.ModifiedDate,
                        Name = d.Name,
                        StatusTopic = t,
                        StatusTopicId = t.Id
                    };
            }

            return query;
        }

        public async Task<MqttBroker> SaveBroker(MqttBrokerDto broker)
        {
            var existingBroker = await GetBrokerByHost(broker.Host);
            if (existingBroker != null)
            {
                return null;
            }

            var newBroker = new MqttBroker
            {
                Host = broker.Host,
                Port = broker.Port,
                Username = broker.Username,
                Password = broker.Password,
                IsActive = true,
                CreatedDate = DateTime.Now,
                UseTls = broker.UseTls,
                KeepAliveSeconds = broker.KeepAliveSeconds,
                WebSocketsPort = broker.WebSocketsPort
            };

            _context.Brokers.Add(newBroker);
            await _context.SaveChangesAsync();
            return newBroker;
        }

        public async Task<MqttBroker> UpdateBroker(int id, MqttBrokerDto broker)
        {
            var existingBroker = await _context.Brokers.FirstOrDefaultAsync(b => b.Id == id);
            if (existingBroker == null)
            {
                return null;
            }
            
            existingBroker.ModifiedDate = DateTime.Now;
            existingBroker.Host = broker.Host;
            existingBroker.Port = broker.Port;
            existingBroker.Username = broker.Username;
            existingBroker.Password = broker.Password;
            existingBroker.IsActive = broker.IsActive;
            existingBroker.UseTls = broker.UseTls;
            existingBroker.KeepAliveSeconds = broker.KeepAliveSeconds;
            existingBroker.DiscoveryTopic = broker.DiscoveryTopic;
            existingBroker.WebSocketsPort = broker.WebSocketsPort;
            
            await _context.SaveChangesAsync();
            return existingBroker;
        }

        public async Task<MqttBroker> GetBrokerById(int id)
        {
            var result = await _context.Brokers.FirstOrDefaultAsync(b => b.Id == id);
            return result;
        }

        public async Task<List<MqttTopic>> GetTopics(bool activeOnly)
        {
            var topics = activeOnly
                ? await _context.Topics.Where(t => t.IsActive).ToListAsync()
                : await _context.Topics.ToListAsync();

            return topics;
        }

        public async Task<MqttTopic> UpdateTopic(int id, MqttTopicDto topic)
        {
            var existingTopic = await _context.Topics.FirstOrDefaultAsync(t => t.Id == id);
            if (existingTopic == null)
            {
                return null;
            }

            existingTopic.Name = topic.Name;
            existingTopic.BrokerId = topic.BrokerId;
            existingTopic.IsActive = topic.IsActive;
            existingTopic.ModifiedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return existingTopic;
        }

        public async Task<Device> UpdateDevice(int id, DeviceDto device)
        {
            var existingDevice = await _context.Devices.FirstOrDefaultAsync(d => d.Id == id);
            if (existingDevice == null)
            {
                return null;
            }

            existingDevice.Name = device.Name;
            existingDevice.ControlTopicId = device.ControlTopicId;
            existingDevice.StatusTopicId = device.StatusTopicId;
            existingDevice.IsActive = device.IsActive;
            existingDevice.ModifiedDate = DateTime.Now;
            existingDevice.Class = device.Class;

            await _context.SaveChangesAsync();
            return existingDevice;
        }

        public async Task<Device> AddDevice(DeviceDto device)
        {
            var dev = await _context.Devices
                .FirstOrDefaultAsync(d => d.Name.ToLower().Equals(device.Name.ToLower()));
            if (dev != null)
            {
                return null;
            }

            var newDevice = new Device
            {
                Name = device.Name,
                StatusTopicId = device.StatusTopicId,
                ControlTopicId = device.ControlTopicId,
                CreatedDate = DateTime.Now,
                Class = device.Class,
                IsActive = true
            };

            _context.Devices.Add(newDevice);
            await _context.SaveChangesAsync();
            return newDevice;
        }

        public async Task<List<MqttMessage>> GetMessages()
        {
            return await _context.Messages.ToListAsync();
        }

        public IQueryable<MqttMessageDto> GetMessagesQueryable()
        {
            var query = from m in _context.Messages
                join t in _context.Topics on m.TopicId equals t.Id
                where t.IsActive
                group new { m.Id, m.ClientId, m.Content, m.Timestamp, t.Name } 
                    by new { m.Id, m.ClientId, m.Content, m.Timestamp, t.Name }
                into g
                orderby g.Key.Id descending
                select new MqttMessageDto
                {
                    Id = g.Key.Id,
                    ClientId = g.Key.ClientId,
                    Content = g.Key.Content,
                    Timestamp = g.Key.Timestamp,
                    TopicName = g.Key.Name
                };
            return query;
        }
    }
}