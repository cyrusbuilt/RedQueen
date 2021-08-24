namespace RedQueen.Data.Models.Dto
{
    public class MqttTopicDto
    {
        public string Name { get; set; }
        
        public int BrokerId { get; set; }
        
        public bool IsActive { get; set; }
    }
}