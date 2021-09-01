using Microsoft.EntityFrameworkCore;
using RedQueen.Data.Models.Db;

namespace RedQueen.Data
{
    public class RedQueenContext : DbContext
    {
        public RedQueenContext(DbContextOptions<RedQueenContext> options) : base(options) {}
        
        public DbSet<MqttBroker> Brokers { get; set; }
        
        public DbSet<MqttTopic> Topics { get; set; }
        
        public DbSet<MqttMessage> Messages { get; set; }

        public DbSet<Device> Devices { get; set; }
        
        public DbSet<Card> Cards { get; set; }
        
        public DbSet<AccessControlUser> AccessControlUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MqttTopic>(entity =>
            {
                entity.HasIndex(t => t.Id).IsUnique();
            });

            modelBuilder.Entity<MqttMessage>(entity =>
            {
                entity.HasIndex(t => t.Id).IsUnique();
            });

            modelBuilder.Entity<MqttBroker>(entity =>
            {
                entity.HasIndex(t => t.Id).IsUnique();
            });

            modelBuilder.Entity<Device>(entity =>
            {
                entity.HasIndex(t => t.Id).IsUnique();
            });

            modelBuilder.Entity<Card>(entity =>
            {
                entity.HasIndex(t => t.Id).IsUnique();
            });

            modelBuilder.Entity<AccessControlUser>(entity =>
            {
                entity.HasIndex(t => t.Id).IsUnique();
            });
            
            modelBuilder.Entity<MqttTopic>()
                .HasOne(b => b.Broker)
                .WithMany(t => t.Topics)
                .HasForeignKey(t => t.BrokerId);

            modelBuilder.Entity<MqttMessage>()
                .HasOne(m => m.Topic)
                .WithMany(t => t.Messages)
                .HasForeignKey(m => m.TopicId);
            
            base.OnModelCreating(modelBuilder);
        }
    }
}