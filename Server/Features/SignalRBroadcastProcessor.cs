using Hubs;
using Microsoft.AspNetCore.SignalR;

public class SignalRBroadcastProcessor : ISimulationProcessor
{
    public int Order => 1000;

    public bool CanBeParallel => false;

    private readonly IHubContext<GridHub> hub;

    public SignalRBroadcastProcessor(IHubContext<GridHub> hub)
    {
        this.hub = hub;
    }

    public void Execute(IKernelStorage kernel)
    {
        int tick = kernel.GetGrid().CurrentTick;
        hub.Clients.All.SendAsync("ReceiveSimulationState", new {currentTick = tick})
        .GetAwaiter().GetResult();
    }
}