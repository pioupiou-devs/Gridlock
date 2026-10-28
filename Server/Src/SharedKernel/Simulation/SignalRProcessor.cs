using Microsoft.AspNetCore.SignalR;
using SharedKernel.Services;
using SharedKernel.SignalR;

namespace SharedKernel.Simulation
{
    public abstract class SignalRProcessor(IHubContext<GridHub> hub) : ISimulationProcessor
    {
        public abstract int Order { get; }
        public virtual bool CanBeParallel { get; } = false;

        private readonly IHubContext<GridHub> hub = hub;

        public abstract void Execute(IKernelStorage kernel);
    }
}