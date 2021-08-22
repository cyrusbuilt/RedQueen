using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        
        public MqttBroker Broker { get; set; }
        
        public ICollection<MqttMessage> Messages { get; set; }
    }
}