using System;

namespace RedQueen.Data.Models.Dto
{
    public class MqttMessageDto
    {
        public int Id { get; set; }
        
        public string Content { get; set; }
        
        public DateTime Timestamp { get; set; }
        
        public string TopicName { get; set; }
        
        public string ClientId { get; set; }
    }
}