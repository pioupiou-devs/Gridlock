using SharedKernel.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGridlockCoreServices(builder.Configuration);

var app = builder.Build();

app.UseGridlockHttpPipeline();
app.Run();
