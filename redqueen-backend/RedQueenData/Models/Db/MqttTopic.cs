using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace RedQueen.Data.Models.Db
{
    [Table("mqtt_topic")]
    public class MqttTopic
    {
        [Key]
        [Column("topic_id")]
        public int Id { get; set; }
        
        [Column("topic_name")]
        public string Name { get; set; }
        
        [Column("broker_id")]
        public int BrokerId { get; set; }
        
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }
        
        [Column("modified_date")]
        public DateTime? ModifiedDate { get; set; }
        
        [Column("is_active")]
        public bool IsActive { get; set; }
        
        [JsonIgnore]
        public MqttBroker Broker { get; set; }
        
        [JsonIgnore]
        public ICollection<MqttMessage> Messages { get; set; }
    }
}