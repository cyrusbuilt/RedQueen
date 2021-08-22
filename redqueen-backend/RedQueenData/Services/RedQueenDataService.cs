using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RedQueen.Data.Models.Db;

namespace RedQueen.Data.Services
{
    public interface IRedQueenDataService
    {
        Task<List<MqttBroker>> GetMqttBrokers();
        Task<MqttBroker> GetBrokerByHost(string host);
        Task<bool> TopicExists(string topic);
        Task<MqttTopic> GetTopic(string topic);
        Task<bool> SaveTopic(string topicName, int brokerId);
        Task SaveMqttMessage(string message, int topicId, string clientId);
    }
    
    public class RedQueenDataService : IRedQueenDataService
    {
        private readonly RedQueenContext _context;

        public RedQueenDataService(IServiceProvider services)
        {
            var scope = services.CreateScope();
            _context = scope.ServiceProvider.GetRequiredService<RedQueenContext>();
        }

        public async Task<List<MqttBroker>> GetMqttBrokers()
        {
            var query = from x in _context.Brokers
                where x.IsActive
                select x;
            var brokers = await query.ToListAsync();
            
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
    }
}