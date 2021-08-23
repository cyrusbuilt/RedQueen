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
        Task<bool> TopicExists(string topic);
        Task<MqttTopic> GetTopic(string topic);
        Task<bool> SaveTopic(string topicName, int brokerId);
        Task SaveMqttMessage(string message, int topicId, string clientId);
        Task<List<Device>> GetDevices();
        Task<MqttBroker> SaveBroker(MqttBrokerDto broker);
        Task<MqttBroker> UpdateBroker(int id, MqttBrokerDto broker);
        
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

        public async Task<bool> SaveTopic(string topicName, int brokerId)
        {
            var exists = await TopicExists(topicName);
            if (exists) return false;
            
            _context.Topics.Add(new MqttTopic
            {
                Name = topicName,
                CreatedDate = DateTime.Now,
                BrokerId = brokerId
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

        public async Task<List<Device>> GetDevices()
        {
            var devices = await _context.Devices.Where(d => d.IsActive).ToListAsync();
            foreach (var device in devices)
            {
                device.StatusTopic = await _context.Topics.FirstOrDefaultAsync(t => t.Id == device.StatusTopicId);
                device.ControlTopic = await _context.Topics.FirstOrDefaultAsync(t => t.Id == device.ControlTopicId);
            }

            return devices;
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
                KeepAliveSeconds = broker.KeepAliveSeconds
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
            
            await _context.SaveChangesAsync();
            return existingBroker;
        }
    }
}