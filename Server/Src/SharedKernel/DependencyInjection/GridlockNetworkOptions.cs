namespace SharedKernel.DependencyInjection;

public sealed class GridlockNetworkOptions
{
    public const string SectionName = "Gridlock:Network";
    public const string DefaultFrontendUrl = "http://localhost:5173";
    public const string DefaultSignalRHubPath = "/gridhub";

    public string SignalRHubPath { get; init; } = DefaultSignalRHubPath;
    public string? FrontendUrl { get; init; }
    public string[] AllowedOrigins { get; init; } = [];
}
