namespace RedQueenAPI.Models
{
    public class PasswordResetRequest
    {
        public string UserId { get; set; }
        
        public string Token { get; set; }
        
        public string NewPassword { get; set; }
    }
}