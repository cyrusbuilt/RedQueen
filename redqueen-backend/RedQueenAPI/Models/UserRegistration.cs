using System.ComponentModel.DataAnnotations;

namespace RedQueenAPI.Models
{
    public class UserRegistration : UserLogin
    {
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }
        
        public string Phone { get; set; }
    }
}