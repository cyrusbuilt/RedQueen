using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RedQueen.Data.Models.Db;

namespace RedQueen.Data.Services
{
    public interface IHistoricalDataService
    {
        Task<List<MqttMessage>> GetHistoricalDataForClient(int topicId, int numDays);
    }
    
    public class HistoricalDataService : IHistoricalDataService
    {
        private readonly DatabaseContexts _contexts;

        public HistoricalDataService(DatabaseContexts contexts)
        {
            _contexts = contexts;
        }

        public async Task<List<MqttMessage>> GetHistoricalDataForClient(int topicId, int numDays)
        {
            var dataContext = _contexts.RedQueenContext;
            var query = from msg in dataContext.Messages
                where msg.TopicId == topicId && msg.Timestamp > DateTime.Now.AddDays(-numDays)
                orderby msg.Timestamp descending
                select msg;

            return await query.ToListAsync();
        }
    }
}