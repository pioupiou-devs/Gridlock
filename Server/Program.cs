using SharedKernel.Services;
using SharedKernel.SignalR;
using SharedKernel.Simulation;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = (Environment.GetEnvironmentVariable("ALLOWED_ORIGINS")
    ?? Environment.GetEnvironmentVariable("FRONTEND_URL")
    ?? "http://localhost:5173")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

// Configure CORS policy to accept front end
builder.Services.AddCors(options =>
{
    options.AddPolicy("SignalRPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddOpenApi("internal");
builder.Services.AddSignalR();

// Custom service registery
builder.Services.AddSingleton<IKernelStorage, KernelStorage>();

//Processors


// Background service
builder.Services.AddSingleton<SimulationEngine>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<SimulationEngine>());

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapOpenApi("/openapi/{documentName}.json");
if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference("/swagger");
}

app.UseCors("SignalRPolicy");
app.MapHub<GridHub>("/gridhub");
app.MapControllers();

app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    await next();
});

app.UseHttpsRedirection();
app.Run();
