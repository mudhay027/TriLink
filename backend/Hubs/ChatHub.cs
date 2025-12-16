using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using Backend.Models.DTO;

namespace Backend.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        public async Task JoinThread(string threadId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, threadId);
        }

        public async Task LeaveThread(string threadId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, threadId);
        }

        public async Task SendTypingIndicator(string threadId, bool isTyping)
        {
            var userId = Context.User?.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            await Clients.OthersInGroup(threadId).SendAsync("UserTyping", new 
            { 
                ThreadId = threadId, 
                UserId = userId, 
                IsTyping = isTyping 
            });
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userId = Context.User?.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}
