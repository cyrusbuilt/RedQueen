using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RedQueen.Data.Models.Db;

namespace RedQueen.Data.Services
{
    public interface ICardService
    {
        IQueryable<Card> GetCards();
        Task<List<AccessControlUser>> GetActiveUsers();
        Task<Card> UpdateCard(Card card);
    }
    
    public class CardService : ICardService
    {
        private readonly DatabaseContexts _contexts;

        public CardService(DatabaseContexts contexts)
        {
            _contexts = contexts;
        }

        public IQueryable<Card> GetCards()
        {
            var context = _contexts.RedQueenContext;

            var query = from c in context.Cards
                join u in context.AccessControlUsers on c.AccessControlUserId equals u.Id
                select new Card
                {
                    Id = c.Id,
                    Serial = c.Serial,
                    CreatedDate = c.CreatedDate,
                    ModifiedDate = c.ModifiedDate,
                    IsActive = c.IsActive,
                    AccessControlUserId = c.AccessControlUserId,
                    User = u
                };

            return query;
        }

        public async Task<List<AccessControlUser>> GetActiveUsers()
        {
            return await _contexts.RedQueenContext.AccessControlUsers
                .Where(u => u.IsActive).ToListAsync();
        }

        public async Task<Card> UpdateCard(Card card)
        {
            var context = _contexts.RedQueenContext;
            
            var existingCard = await context.Cards.FirstOrDefaultAsync(c => c.Id == card.Id);
            if (existingCard == null)
            {
                return null;
            }

            existingCard.Serial = card.Serial;
            existingCard.IsActive = card.IsActive;
            existingCard.AccessControlUserId = card.AccessControlUserId;
            existingCard.User = card.User;
            existingCard.ModifiedDate = DateTime.Now;

            await context.SaveChangesAsync();

            return existingCard;
        }
    }
}