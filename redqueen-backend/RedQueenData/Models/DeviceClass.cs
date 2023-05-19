namespace RedQueen.Data.Models
{
    public static class DeviceClass
    {
        public const string ArduDesk = "ardudesk";
        public const string CyGarage = "cygarage";
        public const string CyLights = "cylights";
        public const string Cylence = "cylence";
        public const string ClController = "clcontroller";
        public const string EspStat = "espstat";
        public const string CyEnviron = "cyenviron";
        public const string CySump = "cysump";
        public const string BinarySensor = "binary_sensor";
        public const string AlarmControlPanel = "alarm_control_panel";
        public const string Camera = "camera";
        public const string Cover = "cover";
        public const string DeviceTracker = "device_tracker";
        public const string DeviceTrigger = "device_trigger";
        public const string Fan = "fan";
        public const string Humidifier = "humidifier";
        public const string Hvac = "hvac";
        public const string Light = "light";
        public const string Lock = "lock";
        public const string Number = "number";
        public const string Scene = "scene";
        public const string Select = "select";
        public const string Sensor = "sensor";
        public const string Switch = "switch";
        public const string TagScanner = "tag_scanner";
        public const string Vacuum = "vacuum";
        public static readonly string[] All = {
            ArduDesk,
            Camera,
            Cover,
            Fan,
            Humidifier,
            Hvac,
            Light,
            Lock,
            Number,
            Scene,
            Select,
            Sensor,
            Switch,
            Vacuum,
            BinarySensor,
            ClController, 
            CyGarage,
            CyEnviron,
            CyLights,
            Cylence,
            CySump,
            DeviceTracker,
            DeviceTrigger,
            EspStat,
            TagScanner,
            AlarmControlPanel
        };
    }
}