namespace RedQueen.Data.Models.Dto
{
    public class DeviceDto
    {
        public string Name { get; set; }
        
        public int ControlTopicId { get; set; }
        
        public int StatusTopicId { get; set; }
        
        public bool IsActive { get; set; }
        
        public string Class { get; set; }
    }
}