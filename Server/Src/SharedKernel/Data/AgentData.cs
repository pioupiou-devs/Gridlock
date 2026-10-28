namespace SharedKernel.Data
{
    public class AgentData(int maxAgentCount)
    {
        private readonly int maxAgentCount = maxAgentCount;

        private readonly int[] agentX = new int[maxAgentCount];
        private readonly int[] agentY = new int[maxAgentCount];
        private readonly byte[] agentStress = new byte[maxAgentCount];
        private readonly bool[] isAgentActive = new bool[maxAgentCount];
        private int ActiveCount = 0;

        public int Spawn(int x, int y)
        {
            for (int i = 0; i < maxAgentCount; i++)
            {
                if (!isAgentActive[i])
                {
                    isAgentActive[i] = true;
                    agentX[i] = x;
                    agentY[i] = y;
                    agentStress[i] = 0;
                    ActiveCount++;
                    return i;
                }
            }
            return -1;
        }

        public void Move(int i, int x, int y)
        {
            if (!isAgentActive[i]) return;

            agentX[i] = x;
            agentY[i] = y;
        }

        public void Despawn(int i)
        {
            if (!isAgentActive[i]) return;

            isAgentActive[i] = false;
            ActiveCount--;
        }
    }
}