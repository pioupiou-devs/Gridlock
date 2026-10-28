public class SimulationEngine(IEnumerable<ISimulationProcessor> processors, IKernelStorage kernel) : BackgroundService
{
    private readonly IEnumerable<ISimulationProcessor> simulationProcessors = [.. processors.OrderBy(p => p.Order)];

    // Time Control
    public bool IsRunning { get; set; } = true;//false;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        PeriodicTimer timer = new(TimeSpan.FromMilliseconds(100));

        while(await timer.WaitForNextTickAsync(stoppingToken))
        {
            // Pause mode
            if(!IsRunning) continue;

            foreach (var processor in simulationProcessors)
            {
                processor.Execute(kernel);
            }

        }
    }
}