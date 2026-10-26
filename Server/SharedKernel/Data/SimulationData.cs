public class SimulationData
{
    private readonly int maxAgentCount;

    private readonly int[] AgentX;
    private readonly int[] AgentY;
    private readonly byte[] AgentStress;
    private readonly bool[] IsActive;
    private int ActiveCount;

    public SimulationData(int maxAgentCount = 5000)
    {
        this.maxAgentCount = maxAgentCount;

        AgentX = new int[maxAgentCount];
        AgentY = new int[maxAgentCount];
        AgentStress = new byte[maxAgentCount];
        IsActive = new bool[maxAgentCount];

        ActiveCount = 0;
    }

    public int Spawn(int x, int y)
    {
        for (int i = 0; i < IsActive.Length; i++)
        {
            if (!IsActive[i])
            {
                IsActive[i] = true;
                AgentX[i] = x;
                AgentY[i] = y;
                AgentStress[i] = 0;
                ActiveCount++;
                return i;
            }
        }
        return -1;
    }

    public void Move(int i, int x, int y)
    {
        if(!IsActive[i]) return;

        AgentX[i] = x;
        AgentY[i] = y;
    }

    public void Despawn(int i)
    {
        if(!IsActive[i]) return;

        IsActive[i] = false;
        ActiveCount--;
    }
}