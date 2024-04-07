export default class DeviceClass {
  public static readonly ArduDesk: string = 'ardudesk';
  public static readonly CyGarage: string = 'cygarage';
  public static readonly CyLights: string = 'cylights';
  public static readonly Cylence: string = 'cylence';
  public static readonly ClController: string = 'clcontroller';
  public static readonly EspStat: string = 'espstat';
  public static readonly CyEnviron: string = 'cyenviron';
  public static readonly CySump: string = 'cysump';
  public static readonly BinarySensor: string = 'binary_sensor';
  public static readonly AlarmControlPanel: string = 'alarm_control_panel';
  public static readonly Camera: string = 'camera';
  public static readonly Cover: string = 'cover';
  public static readonly DeviceTracker: string = 'device_tracker';
  public static readonly DeviceTrigger: string = 'device_trigger';
  public static readonly Fan: string = 'fan';
  public static readonly Humidifier: string = 'humidifier';
  public static readonly Hvac: string = 'hvac';
  public static readonly Light: string = 'light';
  public static readonly Lock: string = 'lock';
  public static readonly Number: string = 'number';
  public static readonly Scene: string = 'scene';
  public static readonly Select: string = 'select';
  public static readonly Sensor: string = 'sensor';
  public static readonly Switch: string = 'switch';
  public static readonly TagScanner: string = 'tag_scanner';
  public static readonly Vacuum: string = 'vacuum';
  public static readonly ALL: string[] = [
    DeviceClass.ArduDesk,
    DeviceClass.Camera,
    DeviceClass.Cover,
    DeviceClass.Fan,
    DeviceClass.Humidifier,
    DeviceClass.Hvac,
    DeviceClass.Light,
    DeviceClass.Lock,
    DeviceClass.Number,
    DeviceClass.Scene,
    DeviceClass.Select,
    DeviceClass.Sensor,
    DeviceClass.Switch,
    DeviceClass.Vacuum,
    DeviceClass.BinarySensor,
    DeviceClass.ClController,
    DeviceClass.CyGarage,
    DeviceClass.CyEnviron,
    DeviceClass.CyLights,
    DeviceClass.Cylence,
    DeviceClass.CySump,
    DeviceClass.DeviceTracker,
    DeviceClass.DeviceTrigger,
    DeviceClass.EspStat,
    DeviceClass.TagScanner,
    DeviceClass.AlarmControlPanel,
  ];
}
