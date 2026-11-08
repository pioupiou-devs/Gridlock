
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using SharedKernel.Simulation;

[ApiController]
[Route("api/time")]
public class TimeControlController(SimulationEngine simulation) : ControllerBase
{
    // GET: /api/time
    [HttpGet("")]
    public IActionResult GetTime()
    {
        return Ok(
            new
            {
                isRunning = simulation.IsRunning(),
                currentSpeed = simulation.GetTimeSpeed()
            });
    }

    // POST: /api/time/play
    [HttpPost("play")]
    public IActionResult PlaySimulation()
    {
        simulation.Play();
        return Ok(
            new
            {
                success = true,
                isRunning = simulation.IsRunning()
            });
    }

    // POST: /api/time/pause
    [HttpPost("pause")]
    public IActionResult PauseSimulation()
    {
        simulation.Pause();
        return Ok(
            new
            {
                success = true,
                isRunning = simulation.IsRunning()
            });
    }

    // POST: /api/time/speed
    [HttpPost("speed")]
    public IActionResult ChangeSpeed([FromBody] float newSpeed)
    {
        simulation.SetTimeSpeed(newSpeed);
        return Ok(
            new
            {
                success = true,
                currentSpeed = simulation.GetTimeSpeed()
            });
    }
}