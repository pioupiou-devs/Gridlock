public class KernelStorage : IKernelStorage {
    private readonly GridMatrix grid;
    private readonly SimulationData data;

    public KernelStorage()
    {
        grid = new GridMatrix();
        data = new SimulationData();
    }

    public GridMatrix GetGrid() => grid;
    public SimulationData GetData() => data;
}
