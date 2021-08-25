using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace RedQueenAPI.Collections
{
    public class PaginatedList<T>
    {
        private const int GetAll = 0;

        // Pseudo-constructor used instead of normal constructor due to needing async.
        public static async Task<PaginatedList<T>> BuildPaginatedList(IQueryable<T> query, int pageSize, int currentPage)
        {
            PaginatedList<T> ret;
            
            // If the page is 0, then we assume they want all records.
            if (pageSize == GetAll)
            {
                var items = await query.ToListAsync();
            
                ret = new PaginatedList<T> { ContentSize = items.Count, Items = items };
            }
            else
            {
                var skip = (currentPage - 1) * pageSize;

                var contentSize = await query.CountAsync();
                var items = await query.Skip(skip).Take(pageSize).ToListAsync();

                ret = new PaginatedList<T> {ContentSize = contentSize, Items = items};
            }

            return ret;
        }
        
        public int ContentSize { get; set; }
        
        public List<T> Items { get; set; }
    }
}