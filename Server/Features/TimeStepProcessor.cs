public class TimeStepProcessor : ISimulationProcessor
{
    public int Order => 10;

    public bool CanBeParallel => false;

    public void Execute(IKernelStorage kernel)
    {
        kernel.GetGrid().CurrentTick++;
        Console.WriteLine($"[Engine] Calcul du Tour {kernel.GetGrid().CurrentTick} réussi.");
    }
}