using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RedQueen.Data.Models.Db
{
    [Table("card")]
    public class Card
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("serial")]
        public string Serial { get; set; }
        
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }
        
        [Column("is_active")]
        public bool IsActive { get; set; }
        
        [Column("access_control_user_id")]
        public int? AccessControlUserId { get; set; }
        
        public AccessControlUser User { get; set; }
    }
}