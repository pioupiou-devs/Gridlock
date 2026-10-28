using SharedKernel.Data;

namespace SharedKernel.Services
{
    public class KernelStorage(int matrixSize = 48, int maxAgentCount = 5000) : IKernelStorage
    {
        public GridMatrix Grid { get; init; } = new GridMatrix(matrixSize);
        public AgentData Data { get; init; } = new AgentData(maxAgentCount);
    }
}