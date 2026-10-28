using SharedKernel.Services;

namespace SharedKernel.Simulation
{
    public interface ISimulationProcessor
    {
        public int Order { get; }
        public bool CanBeParallel { get; }
        void Execute(IKernelStorage kernel);
    }
}
