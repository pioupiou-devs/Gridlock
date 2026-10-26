using Microsoft.AspNetCore.SignalR;

namespace Hubs
{
    public class GridHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}