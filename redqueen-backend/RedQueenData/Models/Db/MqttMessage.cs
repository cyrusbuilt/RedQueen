using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace RedQueen.Data.Models.Db
{
    [Table("mqtt_message")]
    public class MqttMessage
    {
        [Key]
        [Column("msg_id")]
        public int Id { get; set; }
        
        [Column("msg_content")]
        public string Content { get; set; }
        
        [Column("timestamp")]
        public DateTime Timestamp { get; set; }
        
        [Column("topic_id")]
        public int TopicId { get; set; }
        
        [Column("client_id")]
        public string ClientId { get; set; }
        
        [JsonIgnore]
        public MqttTopic Topic { get; set; }
    }
}