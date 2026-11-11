using SharedKernel.Services;
using SharedKernel.Simulation;

namespace SharedKernel.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public const string SignalRPolicyName = "SignalRPolicy";

    public static IServiceCollection AddGridlockCoreServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<GridlockNetworkOptions>(configuration.GetSection(GridlockNetworkOptions.SectionName));
        var networkOptions = configuration.GetSection(GridlockNetworkOptions.SectionName).Get<GridlockNetworkOptions>()
            ?? new GridlockNetworkOptions();
        var allowedOrigins = ResolveAllowedOrigins(configuration, networkOptions);

        services.AddCors(options =>
        {
            options.AddPolicy(SignalRPolicyName, policy =>
            {
                policy.WithOrigins(allowedOrigins)
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials();
            });
        });

        services.AddControllers();
        services.AddOpenApi("internal");
        services.AddSignalR();

        services.AddSingleton<IKernelStorage, KernelStorage>();

        services.AddSingleton<SimulationEngine>();
        services.AddHostedService(sp => sp.GetRequiredService<SimulationEngine>());

        return services;
    }

    private static string[] ResolveAllowedOrigins(IConfiguration configuration, GridlockNetworkOptions networkOptions)
    {
        if (networkOptions.AllowedOrigins.Length > 0)
        {
            return networkOptions.AllowedOrigins;
        }

        var allowedOrigins = configuration["ALLOWED_ORIGINS"];
        if (!string.IsNullOrWhiteSpace(allowedOrigins))
        {
            return allowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        }

        var frontendUrl = networkOptions.FrontendUrl
            ?? configuration["FRONTEND_URL"]
            ?? GridlockNetworkOptions.DefaultFrontendUrl;

        return [frontendUrl];
    }
}
