using System;

namespace RedQueenAPI.Models
{
    public class TokenResponse
    {
        public string UserId { get; set; }
        
        public string Token { get; set; }

        public DateTime Expiration { get; set; }
    }
}