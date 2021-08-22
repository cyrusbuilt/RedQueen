using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RedQueen.Data.Models.Db;

namespace RedQueen.Data.Services
{
    public interface IUserService
    {
        Task<ApplicationUser> GetUser(string userId);
    }
    
    public class UserService : IUserService
    {
        private readonly DatabaseContexts _dbContexts;

        public UserService(DatabaseContexts dbContexts)
        {
            _dbContexts = dbContexts;
        }

        public async Task<ApplicationUser> GetUser(string userId)
        {
            return await _dbContexts.ApplicationDbContext.Users.FirstOrDefaultAsync(u => u.Id.Equals(userId));
        }
    }
}