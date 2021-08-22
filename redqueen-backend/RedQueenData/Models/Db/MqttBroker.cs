using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RedQueen.Data.Models.Db
{
    [Table("mqtt_broker")]
    public class MqttBroker
    {
        [Key]
        [Column("broker_id")]
        public int Id { get; set; }
        
        [Column("broker_host")]
        public string Host { get; set; }
        
        [Column("broker_port")]
        public int Port { get; set; }
        
        [Column("username")]
        public string Username { get; set; }
        
        [Column("password")]
        public string Password { get; set; }
        
        [Column("is_active")]
        public bool IsActive { get; set; }
        
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }
        
        [Column("modified_date")]
        public DateTime? ModifiedDate { get; set; }
        
        [Column("use_tls")]
        public bool UseTls { get; set; }
        
        [Column("keep_alive_seconds")]
        public int? KeepAliveSeconds { get; set; }
        
        public IEnumerable<MqttTopic> Topics { get; set; }
    }
}