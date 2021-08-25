using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RedQueen.Data;
using RedQueen.Data.Services;
using RedQueen.Services;
using RedQueen.Settings;

namespace RedQueen
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSystemd()
                .ConfigureLogging(loggerFactory => loggerFactory.AddConsole())
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddHostedService<Worker>();
                    
                    var config = hostContext.Configuration;
                    var settings = new ConfigurationSettings(config);

                    // Can't use services.AddDbContext<RedQueenContext>();
                    
                    var options = new DbContextOptionsBuilder<RedQueenContext>()
                        .UseNpgsql(config.GetConnectionString("RedQueenContext")).Options; 
                    services.AddSingleton(new RedQueenContext(options));
                    services.AddSingleton(settings);
                    services.AddSingleton<IRedQueenDataService, RedQueenDataService>();
                    services.AddSingleton<IMqttServiceManager, MqttServiceManager>();
                });
    }
}