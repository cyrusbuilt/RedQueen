using RedQueen.Data.Models.Db;

namespace RedQueen.Data.Models.Dto
{
    public class LoginHistoryDto : LoginHistory
    {
        public string UserName { get; set; }
        
        public string Email { get; set; }
    }
}