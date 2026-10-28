using SharedKernel.Data;

namespace SharedKernel.Services
{
    public interface IKernelStorage
    {
        GridMatrix Grid {get; init;}
        AgentData Data{get; init;}
    }
}