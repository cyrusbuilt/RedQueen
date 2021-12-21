export interface Cygate4LockReader {
  id: number;
}

export interface Cygate4Keypad extends Cygate4LockReader {}

export interface Cygate4DoorInput {
  type: number;
  moduleId: number;
  inputId: number;
}

export interface Cygate4LockRelay {
  moduleId: number;
  relayId: number;
}

export interface Cygate4Door {
  name: string;
  state: number;
  enabled: number;
  lockState: number;
  lockRelay?: Cygate4LockRelay;
  readers: Cygate4LockReader[];
  keypads: Cygate4Keypad[];
  inputs: Cygate4DoorInput[];
}

export interface Cygate4Status {
  clientId: string;
  systemState: number;
  firmwareVersion: string;
  armState: number;
  statusMsg: string;
  doors: Cygate4Door[];
}
