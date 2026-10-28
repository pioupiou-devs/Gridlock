using Microsoft.AspNetCore.SignalR;

namespace SharedKernel.SignalR
{
    public class GridHub : Hub
    {
        public async Task SendMessage(string user, string message) 
            => await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}