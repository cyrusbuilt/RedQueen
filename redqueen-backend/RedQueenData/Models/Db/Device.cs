using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        public int ControlTopicId { get; set; }
        
        [Column("status_topic_id")]
        public int StatusTopicId { get; set; }
        
        [Column("is_active")]
        public bool IsActive { get; set; }
        
        public MqttTopic StatusTopic { get; set; }
        
        public MqttTopic ControlTopic { get; set; }
    }
}