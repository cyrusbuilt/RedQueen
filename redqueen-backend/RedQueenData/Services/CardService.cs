using System.Linq;
using RedQueen.Data.Models.Db;

namespace RedQueen.Data.Services
{
    public interface ICardService
    {
        IQueryable<Card> GetCards();
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
                    IsActive = c.IsActive,
                    AccessControlUserId = c.AccessControlUserId,
                    User = u
                };

            return query;
        }
    }
}