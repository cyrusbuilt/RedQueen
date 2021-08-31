using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RedQueen.Data.Models.Db;
using RedQueen.Data.Models.Dto;

namespace RedQueen.Data.Services
{
    public interface IUserService
    {
        Task<ApplicationUser> GetUser(string userId);
        Task<List<ApplicationUser>> GetUserList();

        Task LogAccess(string userId);

        IQueryable<LoginHistoryDto> GetLoginHistory(string userId);
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

        public async Task<List<ApplicationUser>> GetUserList()
        {
            return await _dbContexts.ApplicationDbContext.Users.ToListAsync();
        }

        public async Task LogAccess(string userId)
        {
            var record = new LoginHistory
            {
                ApplicationUserId = userId,
                Timestamp = DateTime.Now
            };

            _dbContexts.ApplicationDbContext.LoginHistories.Add(record);
            await _dbContexts.ApplicationDbContext.SaveChangesAsync();
        }

        public IQueryable<LoginHistoryDto> GetLoginHistory(string userId)
        {
            var context = _dbContexts.ApplicationDbContext;
            
            var query = from usr in context.Users
                join log in context.LoginHistories on usr.Id equals log.ApplicationUserId
                let usrId = usr.Id
                let logId = log.Id
                where log.ApplicationUserId.Equals(userId)
                group new { log.ApplicationUserId }
                    by new { UsrId = usrId, usr.Email, usr.UserName, LogId = logId, log.Timestamp, log.ApplicationUserId }
                into g
                orderby g.Key.Timestamp descending
                select new LoginHistoryDto
                {
                    Id = g.Key.LogId,
                    ApplicationUserId = g.Key.UsrId,
                    Email = g.Key.Email,
                    Timestamp = g.Key.Timestamp,
                    UserName = g.Key.UserName
                };
            return query;
        }
    }
}