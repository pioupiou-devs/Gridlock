using Hubs;

var builder = WebApplication.CreateBuilder(args);

// Configure CORS policy to accept front end
builder.Services.AddCors(options =>
{
    options.AddPolicy("SignalRPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()                     
              .AllowAnyHeader()                     
              .AllowCredentials();
    });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSignalR();

// Custom service registery
builder.Services.AddSingleton<IKernelStorage, KernelStorage>();

//Processors
builder.Services.AddSingleton<ISimulationProcessor, TimeStepProcessor>();
builder.Services.AddSingleton<ISimulationProcessor, SignalRBroadcastProcessor>();

// Background service
builder.Services.AddHostedService<SimulationEngine>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("SignalRPolicy");
app.MapHub<GridHub>("/gridhub");

app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    await next();
});

app.UseHttpsRedirection();
app.Run();
