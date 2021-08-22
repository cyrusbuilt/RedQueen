namespace RedQueen.Data
{
    public class DatabaseContexts
    {
        public RedQueenContext RedQueenContext { get; }
        
        public ApplicationDbContext ApplicationDbContext { get; }

        public DatabaseContexts(RedQueenContext redQueenContext, ApplicationDbContext applicationDbContext)
        {
            RedQueenContext = redQueenContext;
            ApplicationDbContext = applicationDbContext;
        }
    }
}