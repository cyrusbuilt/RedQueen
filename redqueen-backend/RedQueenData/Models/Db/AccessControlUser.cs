using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RedQueen.Data.Models.Db
{
    [Table("access_control_user")]
    public class AccessControlUser
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("name")]
        public string Name { get; set; }

        [Column("pin")]
        public string Pin { get; set; }
        
        [Column("is_active")]
        public bool IsActive { get; set; }
        
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }
        
        [Column("modified_date")]
        public DateTime? ModifiedDate { get; set; }
    }
}