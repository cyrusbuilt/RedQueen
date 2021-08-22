using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RedQueen.Data.Models.Db
{
    [Table("login_history")]
    public class LoginHistory
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("asp_net_user_id")]
        public string ApplicationUserId { get; set; }
        
        [Column("timestamp")]
        public DateTime Timestamp { get; set; }
    }
}