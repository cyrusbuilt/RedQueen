using System;
using System.Text.Json.Serialization;

namespace RedQueen.Data.Models.Dto
{
    public class RedQueenSystemStatus
    {
        [JsonPropertyName("timestamp")]
        public DateTime Timestamp { get; set; }
        
        [JsonPropertyName("status")]
        public int Status { get; set; }
        
        [JsonPropertyName("daemonVersion")]
        public string DaemonVersion { get; set; }
    }
}