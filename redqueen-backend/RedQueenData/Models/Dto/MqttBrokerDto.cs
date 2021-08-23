namespace RedQueen.Data.Models.Dto
{
    public class MqttBrokerDto
    {
        public string Host { get; set; }
        
        public int Port { get; set; }
        
        public string Username { get; set; }
        
        public string Password { get; set; }
        
        public bool IsActive { get; set; }
        
        public bool UseTls { get; set; }
        
        public int? KeepAliveSeconds { get; set; }
    }
}