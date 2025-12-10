using Microsoft.EntityFrameworkCore;
using TriLink.Models;

namespace TriLink.Data
{
    public class TriLinkDBContext : DbContext
    {
        public TriLinkDBContext(DbContextOptions<TriLinkDBContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<OfferThread> OfferThreads { get; set; } = null!;
        public DbSet<OfferMessage> OfferMessages { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;

        public DbSet<OrderStatusHistory> OrderStatusHistories { get; set; } = null!;
        public DbSet<LogisticsJob> LogisticsJobs { get; set; } = null!;
        public DbSet<LogisticsQuote> LogisticsQuotes { get; set; } = null!;
        public DbSet<RouteSuggestion> RouteSuggestions { get; set; } = null!;
        public DbSet<Document> Documents { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            
            modelBuilder.Entity<User>()
                .HasKey(u => u.Id);

            //  unique Email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // ============================
            // PRODUCTS
            // ============================
            modelBuilder.Entity<Product>()
                .HasKey(p => p.Id);

            // Product.SupplierId -> Users(Id)
            modelBuilder.Entity<Product>()
                .HasOne<User>()                         
                .WithMany()                             
                .HasForeignKey(p => p.SupplierId)       
                .OnDelete(DeleteBehavior.Restrict);     

            // ============================
            // OFFER THREADS (Negotiations)
            // ============================
            modelBuilder.Entity<OfferThread>()
                .HasKey(t => t.Id);

            // OfferThread.ProductId -> Products(Id)
            modelBuilder.Entity<OfferThread>()
                .HasOne<Product>()
                .WithMany()
                .HasForeignKey(t => t.ProductId)
                .OnDelete(DeleteBehavior.Restrict);     // prevent deleting product if thread exists

            // OfferThread.BuyerId -> Users(Id)
            modelBuilder.Entity<OfferThread>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(t => t.BuyerId)
                .OnDelete(DeleteBehavior.Restrict);

            // OfferThread.SupplierId -> Users(Id)
            modelBuilder.Entity<OfferThread>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(t => t.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            // ============================
            // OFFER MESSAGES (Offers / Counters)
            // ============================
            modelBuilder.Entity<OfferMessage>()
                .HasKey(m => m.Id);

            // OfferMessage.ThreadId -> OfferThreads(Id)
            modelBuilder.Entity<OfferMessage>()
                .HasOne<OfferThread>()
                .WithMany()
                .HasForeignKey(m => m.ThreadId)
                .OnDelete(DeleteBehavior.Cascade);      // delete messages when thread deleted

            // OfferMessage.SenderUserId -> Users(Id)
            modelBuilder.Entity<OfferMessage>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(m => m.SenderUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ============================
            // ORDERS
            // ============================
            modelBuilder.Entity<Order>()
                .HasKey(o => o.Id);

            // Order.OfferThreadId (nullable) -> OfferThreads(Id)
            modelBuilder.Entity<Order>()
                .HasOne<OfferThread>()
                .WithMany()
                .HasForeignKey(o => o.OfferThreadId)
                .OnDelete(DeleteBehavior.SetNull);      // if thread deleted, keep order but null ref

            // Order.ProductId -> Products(Id)
            modelBuilder.Entity<Order>()
                .HasOne<Product>()
                .WithMany()
                .HasForeignKey(o => o.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Order.BuyerId -> Users(Id)
            modelBuilder.Entity<Order>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(o => o.BuyerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Order.SupplierId -> Users(Id)
            modelBuilder.Entity<Order>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(o => o.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            

            // ============================
            // ORDER STATUS HISTORY
            // ============================
            modelBuilder.Entity<OrderStatusHistory>()
                .HasKey(h => h.Id);

            // OrderStatusHistory.OrderId -> Orders(Id)
            modelBuilder.Entity<OrderStatusHistory>()
                .HasOne<Order>()
                .WithMany()
                .HasForeignKey(h => h.OrderId)
                .OnDelete(DeleteBehavior.Cascade);      // delete history when order deleted

            // OrderStatusHistory.ChangedByUserId -> Users(Id)
            modelBuilder.Entity<OrderStatusHistory>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(h => h.ChangedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ============================
            // LOGISTICS JOBS
            // ============================
            modelBuilder.Entity<LogisticsJob>()
                .HasKey(j => j.Id);

            // LogisticsJob.OrderId -> Orders(Id)
            modelBuilder.Entity<LogisticsJob>()
                .HasOne<Order>()
                .WithMany()
                .HasForeignKey(j => j.OrderId)
                .OnDelete(DeleteBehavior.Cascade);      // delete job when order deleted

            

            // ============================
            // LOGISTICS QUOTES
            // ============================
            modelBuilder.Entity<LogisticsQuote>()
                .HasKey(q => q.Id);

            // LogisticsQuote.LogisticsJobId -> LogisticsJobs(Id)
            modelBuilder.Entity<LogisticsQuote>()
                .HasOne<LogisticsJob>()
                .WithMany()
                .HasForeignKey(q => q.LogisticsJobId)
                .OnDelete(DeleteBehavior.Cascade);      // delete quotes when job deleted

            // LogisticsQuote.LogisticsPartnerId -> Users(Id)
            modelBuilder.Entity<LogisticsQuote>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(q => q.LogisticsPartnerId)
                .OnDelete(DeleteBehavior.Restrict);

            // ============================
            // ROUTE SUGGESTIONS
            // ============================
            modelBuilder.Entity<RouteSuggestion>()
                .HasKey(r => r.Id);

            // RouteSuggestion.LogisticsJobId -> LogisticsJobs(Id)
            modelBuilder.Entity<RouteSuggestion>()
                .HasOne<LogisticsJob>()
                .WithMany()
                .HasForeignKey(r => r.LogisticsJobId)
                .OnDelete(DeleteBehavior.Cascade);      // delete suggestions when job deleted

            // ============================
            // DOCUMENTS (Invoice / Challan)
            // ============================
            modelBuilder.Entity<Document>()
                .HasKey(d => d.Id);

            // Document.OrderId -> Orders(Id)
            modelBuilder.Entity<Document>()
                .HasOne<Order>()
                .WithMany()
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.Cascade);      // delete docs when order deleted
        }
    }


   
}
