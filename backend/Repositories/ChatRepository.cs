using Backend.Data;
using Backend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public interface IChatRepository
    {
        // Thread operations
        Task<ChatThread> CreateThreadAsync(ChatThread thread);
        Task<ChatThread> GetThreadByIdAsync(Guid threadId);
        Task<ChatThread> GetThreadByParticipantsAsync(Guid buyerId, Guid supplierId, Guid productId);
        Task<List<ChatThread>> GetUserThreadsAsync(Guid userId);
        Task UpdateThreadAsync(ChatThread thread);
        
        // Message operations
        Task<ChatMessage> AddMessageAsync(ChatMessage message);
        Task<List<ChatMessage>> GetThreadMessagesAsync(Guid threadId, int skip = 0, int take = 50);
        Task<int> GetUnreadCountAsync(Guid threadId, Guid userId);
        Task MarkMessagesAsReadAsync(Guid threadId, Guid userId);
        
        // Offer operations
        Task<Offer> CreateOfferAsync(Offer offer);
        Task<Offer> GetOfferByIdAsync(Guid offerId);
        Task UpdateOfferAsync(Offer offer);
    }

    public class ChatRepository : IChatRepository
    {
        private readonly TriLinkDbContext _context;

        public ChatRepository(TriLinkDbContext context)
        {
            _context = context;
        }

        // Thread operations
        public async Task<ChatThread> CreateThreadAsync(ChatThread thread)
        {
            await _context.ChatThreads.AddAsync(thread);
            await _context.SaveChangesAsync();
            return thread;
        }

        public async Task<ChatThread> GetThreadByIdAsync(Guid threadId)
        {
            return await _context.ChatThreads
                .Include(t => t.Buyer)
                .Include(t => t.Supplier)
                .Include(t => t.Product)
                .Include(t => t.Messages.OrderByDescending(m => m.CreatedAt).Take(1))
                .FirstOrDefaultAsync(t => t.Id == threadId);
        }

        public async Task<ChatThread> GetThreadByParticipantsAsync(Guid buyerId, Guid supplierId, Guid productId)
        {
            return await _context.ChatThreads
                .Include(t => t.Buyer)
                .Include(t => t.Supplier)
                .Include(t => t.Product)
                .FirstOrDefaultAsync(t => t.BuyerId == buyerId && t.SupplierId == supplierId && t.ProductId == productId);
        }

        public async Task<List<ChatThread>> GetUserThreadsAsync(Guid userId)
        {
            return await _context.ChatThreads
                .Include(t => t.Buyer)
                .Include(t => t.Supplier)
                .Include(t => t.Product)
                .Include(t => t.Messages.OrderByDescending(m => m.CreatedAt).Take(1))
                .Where(t => t.BuyerId == userId || t.SupplierId == userId)
                .OrderByDescending(t => t.LastMessageAt)
                .ToListAsync();
        }

        public async Task UpdateThreadAsync(ChatThread thread)
        {
            _context.ChatThreads.Update(thread);
            await _context.SaveChangesAsync();
        }

        // Message operations
        public async Task<ChatMessage> AddMessageAsync(ChatMessage message)
        {
            await _context.ChatMessages.AddAsync(message);
            await _context.SaveChangesAsync();
            return message;
        }

        public async Task<List<ChatMessage>> GetThreadMessagesAsync(Guid threadId, int skip = 0, int take = 50)
        {
            return await _context.ChatMessages
                .Include(m => m.Sender)
                .Include(m => m.Offer)
                .Where(m => m.ThreadId == threadId)
                .OrderBy(m => m.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<int> GetUnreadCountAsync(Guid threadId, Guid userId)
        {
            return await _context.ChatMessages
                .Where(m => m.ThreadId == threadId && m.SenderId != userId && !m.IsRead)
                .CountAsync();
        }

        public async Task MarkMessagesAsReadAsync(Guid threadId, Guid userId)
        {
            var unreadMessages = await _context.ChatMessages
                .Where(m => m.ThreadId == threadId && m.SenderId != userId && !m.IsRead)
                .ToListAsync();

            foreach (var message in unreadMessages)
            {
                message.IsRead = true;
            }
            await _context.SaveChangesAsync();
        }

        // Offer operations
        public async Task<Offer> CreateOfferAsync(Offer offer)
        {
            await _context.Offers.AddAsync(offer);
            await _context.SaveChangesAsync();
            return offer;
        }

        public async Task<Offer> GetOfferByIdAsync(Guid offerId)
        {
            return await _context.Offers.FirstOrDefaultAsync(o => o.Id == offerId);
        }

        public async Task UpdateOfferAsync(Offer offer)
        {
            _context.Offers.Update(offer);
            await _context.SaveChangesAsync();
        }
    }
}
