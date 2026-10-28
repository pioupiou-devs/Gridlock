using SharedKernel.Services;

namespace SharedKernel.Simulation
{
    public class SimulationEngine(IEnumerable<ISimulationProcessor> processors, IKernelStorage kernel) : BackgroundService
    {
        private readonly IEnumerable<ISimulationProcessor> simulationProcessors = [.. processors.OrderBy(p => p.Order)];

        // Time Control
        private bool isRunning = false;
        private float timeSpeed = 1.0f;
        private int tickCount = 0;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            PeriodicTimer timer = new(TimeSpan.FromSeconds(timeSpeed));

            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                // Pause mode
                if (!isRunning) continue;

                tickCount++;

                foreach (var processor in simulationProcessors)
                {
                    if(processor.CanBeParallel)
                    {
                        // run as parallel
                        processor.Execute(kernel);
                        continue;
                    }
                    
                    processor.Execute(kernel);
                }

            }
        }

        #region Time Control
        public void Pause() => isRunning = false;
        public void Play() => isRunning = true;
        public bool IsRunning() => isRunning;
        public int GetTickCount() => tickCount;
        public void SetTimeSpeed(float speed) => timeSpeed = speed;
        public float GetTimeSpeed() => timeSpeed;
        #endregion
    
    }
}