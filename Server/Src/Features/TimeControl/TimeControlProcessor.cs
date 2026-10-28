using Microsoft.AspNetCore.SignalR;
using SharedKernel.Services;
using SharedKernel.SignalR;
using SharedKernel.Simulation;

public class TimeControlProcessor(IHubContext<GridHub> hub) : SignalRProcessor(hub)
{
    public override int Order => 1000;

    public override bool CanBeParallel => false;

    public override void Execute(IKernelStorage kernel)
    {
        throw new NotImplementedException();
    }
}