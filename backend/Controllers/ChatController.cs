using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Backend.Hubs;
using Backend.Models.Domain;
using Backend.Models.DTO;
using Backend.Repositories;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatRepository _chatRepository;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatController(IChatRepository chatRepository, IHubContext<ChatHub> hubContext)
        {
            _chatRepository = chatRepository;
            _hubContext = hubContext;
        }

        private Guid GetCurrentUserId()
        {
            return Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
        }

        // GET: api/chat/threads
        [HttpGet("threads")]
        public async Task<IActionResult> GetThreads()
        {
            var userId = GetCurrentUserId();
            var threads = await _chatRepository.GetUserThreadsAsync(userId);

            var threadDtos = new List<ChatThreadDto>();
            foreach (var thread in threads)
            {
                var unreadCount = await _chatRepository.GetUnreadCountAsync(thread.Id, userId);
                var lastMessage = thread.Messages?.FirstOrDefault();

                threadDtos.Add(new ChatThreadDto
                {
                    Id = thread.Id,
                    BuyerId = thread.BuyerId,
                    BuyerName = thread.Buyer?.Username,
                    BuyerCompanyName = thread.Buyer?.CompanyName,
                    SupplierId = thread.SupplierId,
                    SupplierName = thread.Supplier?.Username,
                    SupplierCompanyName = thread.Supplier?.CompanyName,
                    ProductId = thread.ProductId,
                    ProductName = thread.Product?.Name,
                    ProductImageUrl = thread.Product?.ImageUrl,
                    Status = thread.Status,
                    LastMessageAt = thread.LastMessageAt,
                    CreatedAt = thread.CreatedAt,
                    LastMessage = lastMessage?.TextMessage ?? "",
                    UnreadCount = unreadCount
                });
            }

            return Ok(threadDtos);
        }

        // POST: api/chat/threads
        [HttpPost("threads")]
        public async Task<IActionResult> CreateThread([FromBody] CreateChatThreadDto dto)
        {
            var userId = GetCurrentUserId();

            // Check if thread already exists
            var existingThread = await _chatRepository.GetThreadByParticipantsAsync(userId, dto.SupplierId, dto.ProductId);
            if (existingThread != null)
            {
                return Ok(new { threadId = existingThread.Id, isNew = false });
            }

            var thread = new ChatThread
            {
                Id = Guid.NewGuid(),
                BuyerId = userId,
                SupplierId = dto.SupplierId,
                ProductId = dto.ProductId,
                Status = "Active",
                LastMessageAt = DateTime.Now,
                CreatedAt = DateTime.Now,
                Messages = new List<ChatMessage>()
            };

            // Add initial message if provided
            if (!string.IsNullOrEmpty(dto.InitialMessage))
            {
                var message = new ChatMessage
                {
                    Id = Guid.NewGuid(),
                    ThreadId = thread.Id,
                    SenderId = userId,
                    SenderRole = "Buyer",
                    MessageType = "Text",
                    TextMessage = dto.InitialMessage,
                    IsRead = false,
                    CreatedAt = DateTime.Now
                };
                thread.Messages.Add(message);
            }

            await _chatRepository.CreateThreadAsync(thread);

            return Ok(new { threadId = thread.Id, isNew = true });
        }

        // GET: api/chat/threads/{threadId}/messages
        [HttpGet("threads/{threadId}/messages")]
        public async Task<IActionResult> GetMessages(Guid threadId, [FromQuery] int skip = 0, [FromQuery] int take = 50)
        {
            var userId = GetCurrentUserId();
            var thread = await _chatRepository.GetThreadByIdAsync(threadId);

            if (thread == null)
                return NotFound("Thread not found");

            // Authorization check
            if (thread.BuyerId != userId && thread.SupplierId != userId)
                return Forbid();

            var messages = await _chatRepository.GetThreadMessagesAsync(threadId, skip, take);

            var messageDtos = messages.Select(m => new ChatMessageDto
            {
                Id = m.Id,
                ThreadId = m.ThreadId,
                SenderId = m.SenderId,
                SenderName = m.Sender?.Username,
                SenderCompanyName = m.Sender?.CompanyName,
                SenderRole = m.SenderRole,
                MessageType = m.MessageType,
                TextMessage = m.TextMessage,
                Offer = m.Offer != null ? new ChatOfferDto
                {
                    Id = m.Offer.Id,
                    Amount = m.Offer.Amount,
                    Quantity = m.Offer.Quantity,
                    Status = "Pending", // TODO: Add status to Offer model
                    CreatedAt = m.Offer.CreatedAt
                } : null,
                IsRead = m.IsRead,
                CreatedAt = m.CreatedAt
            }).ToList();

            return Ok(new
            {
                messages = messageDtos,
                threadInfo = new
                {
                    buyerId = thread.BuyerId,
                    supplierId = thread.SupplierId,
                    buyerCompanyName = thread.Buyer?.CompanyName,
                    supplierCompanyName = thread.Supplier?.CompanyName,
                    productName = thread.Product?.Name
                }
            });
        }

        // POST: api/chat/threads/{threadId}/messages
        [HttpPost("threads/{threadId}/messages")]
        public async Task<IActionResult> SendMessage(Guid threadId, [FromBody] SendMessageDto dto)
        {
            var userId = GetCurrentUserId();
            var thread = await _chatRepository.GetThreadByIdAsync(threadId);

            if (thread == null)
                return NotFound("Thread not found");

            if (thread.BuyerId != userId && thread.SupplierId != userId)
                return Forbid();

            var senderRole = thread.BuyerId == userId ? "Buyer" : "Supplier";

            var message = new ChatMessage
            {
                Id = Guid.NewGuid(),
                ThreadId = threadId,
                SenderId = userId,
                SenderRole = senderRole,
                MessageType = "Text",
                TextMessage = dto.TextMessage,
                IsRead = false,
                CreatedAt = DateTime.Now
            };

            await _chatRepository.AddMessageAsync(message);

            // Update thread's last message time
            thread.LastMessageAt = DateTime.Now;
            await _chatRepository.UpdateThreadAsync(thread);

            // Get sender info for response
            var sender = senderRole == "Buyer" ? thread.Buyer : thread.Supplier;

            var messageDto = new ChatMessageDto
            {
                Id = message.Id,
                ThreadId = message.ThreadId,
                SenderId = message.SenderId,
                SenderName = sender?.Username,
                SenderCompanyName = sender?.CompanyName,
                SenderRole = message.SenderRole,
                MessageType = message.MessageType,
                TextMessage = message.TextMessage,
                IsRead = message.IsRead,
                CreatedAt = message.CreatedAt
            };

            // Send real-time notification
            await _hubContext.Clients.Group(threadId.ToString()).SendAsync("ReceiveMessage", messageDto);

            return Ok(messageDto);
        }

        // POST: api/chat/threads/{threadId}/offers
        [HttpPost("threads/{threadId}/offers")]
        public async Task<IActionResult> CreateOffer(Guid threadId, [FromBody] CreateOfferMessageDto dto)
        {
            var userId = GetCurrentUserId();
            var thread = await _chatRepository.GetThreadByIdAsync(threadId);

            if (thread == null)
                return NotFound("Thread not found");

            if (thread.BuyerId != userId && thread.SupplierId != userId)
                return Forbid();

            var senderRole = thread.BuyerId == userId ? "Buyer" : "Supplier";

            // Create the offer
            var offer = new Offer
            {
                Id = Guid.NewGuid(),
                NegotiationId = thread.NegotiationId ?? Guid.Empty,
                Amount = dto.Amount,
                Quantity = dto.Quantity,
                Message = dto.Message,
                CreatedAt = DateTime.Now,
                ProposerId = userId
            };

            await _chatRepository.CreateOfferAsync(offer);

            // Create chat message for the offer
            var message = new ChatMessage
            {
                Id = Guid.NewGuid(),
                ThreadId = threadId,
                SenderId = userId,
                SenderRole = senderRole,
                MessageType = "Offer",
                TextMessage = dto.Message,
                OfferId = offer.Id,
                IsRead = false,
                CreatedAt = DateTime.Now
            };

            await _chatRepository.AddMessageAsync(message);

            // Update thread
            thread.LastMessageAt = DateTime.Now;
            await _chatRepository.UpdateThreadAsync(thread);

            var sender = senderRole == "Buyer" ? thread.Buyer : thread.Supplier;

            var messageDto = new ChatMessageDto
            {
                Id = message.Id,
                ThreadId = message.ThreadId,
                SenderId = message.SenderId,
                SenderName = sender?.Username,
                SenderCompanyName = sender?.CompanyName,
                SenderRole = message.SenderRole,
                MessageType = message.MessageType,
                TextMessage = message.TextMessage,
                Offer = new ChatOfferDto
                {
                    Id = offer.Id,
                    Amount = offer.Amount,
                    Quantity = offer.Quantity,
                    Status = "Pending",
                    CreatedAt = offer.CreatedAt
                },
                IsRead = message.IsRead,
                CreatedAt = message.CreatedAt
            };

            // Send real-time notification
            await _hubContext.Clients.Group(threadId.ToString()).SendAsync("ReceiveMessage", messageDto);

            return Ok(messageDto);
        }

        // PUT: api/chat/threads/{threadId}/messages/read
        [HttpPut("threads/{threadId}/messages/read")]
        public async Task<IActionResult> MarkAsRead(Guid threadId)
        {
            var userId = GetCurrentUserId();
            var thread = await _chatRepository.GetThreadByIdAsync(threadId);

            if (thread == null)
                return NotFound();

            if (thread.BuyerId != userId && thread.SupplierId != userId)
                return Forbid();

            await _chatRepository.MarkMessagesAsReadAsync(threadId, userId);

            // Notify other participant that messages were read
            await _hubContext.Clients.Group(threadId.ToString()).SendAsync("MessagesRead", new
            {
                ThreadId = threadId,
                ReadBy = userId
            });

            return Ok();
        }
    }
}
