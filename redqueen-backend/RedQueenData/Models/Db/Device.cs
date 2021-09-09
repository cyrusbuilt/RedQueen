using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace RedQueen.Data.Models.Db
{
    [Table("device")]
    public class Device
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("name")]
        public string Name { get; set; }
        
        [Column("control_topic_id")]
        public int? ControlTopicId { get; set; }
        
        [Column("status_topic_id")]
        public int StatusTopicId { get; set; }
        
        [Column("is_active")]
        public bool IsActive { get; set; }
        
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }
        
        [Column("modified_date")]
        public DateTime? ModifiedDate { get; set; }
        
        [Column("class")]
        public string Class { get; set; }
        
        public MqttTopic StatusTopic { get; set; }
        
        public MqttTopic ControlTopic { get; set; }
    }
}