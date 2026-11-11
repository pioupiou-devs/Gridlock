using Scalar.AspNetCore;
using Microsoft.Extensions.Options;
using SharedKernel.SignalR;

namespace SharedKernel.DependencyInjection;

public static class ApplicationBuilderExtensions
{
    public static WebApplication UseGridlockHttpPipeline(this WebApplication app)
    {
        var networkOptions = app.Services.GetRequiredService<IOptions<GridlockNetworkOptions>>().Value;

        app.MapOpenApi("/openapi/{documentName}.json");
        if (app.Environment.IsDevelopment())
        {
            app.MapScalarApiReference("/swagger");
        }

        app.UseCors(ServiceCollectionExtensions.SignalRPolicyName);
        app.MapHub<GridHub>(networkOptions.SignalRHubPath);
        app.MapControllers();

        app.Use(async (context, next) =>
        {
            context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
            context.Response.Headers.Append("X-Frame-Options", "DENY");
            await next();
        });

        app.UseHttpsRedirection();

        return app;
    }
}
