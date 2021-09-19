namespace RedQueenAPI.Models
{
    public class TelemetryResponse
    {
        public string ApiVersion { get; set; }

        public string DaemonStatusTopic { get; set; }
        
        public string DaemonControlTopic { get; set; }
    }
}