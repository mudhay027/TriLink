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
       
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<User>()
                .HasKey(u => u.Id);

            //  unique Email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

        }
    }


   
}
