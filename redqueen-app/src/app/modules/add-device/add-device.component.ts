import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Device } from 'src/app/core/interfaces/device';
import { MqttBroker } from 'src/app/core/interfaces/mqtt-broker';
import { MqttTopic } from 'src/app/core/interfaces/mqtt-topic';
import { DeviceService } from 'src/app/core/services/device.service';
import { TelemetryService } from 'src/app/core/services/telemetry.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent implements OnInit {
  form: UntypedFormGroup;
  submitted: boolean;
  deviceAdded: boolean;
  brokers: MqttBroker[];
  topics: MqttTopic[];
  classes: string[];
  selectedBroker: MqttBroker | null;
  selectedStatusTopic: MqttTopic | null;
  selectedControlTopic: MqttTopic | null;
  selectedClass: string | null;

  constructor(
    private _fb: UntypedFormBuilder,
    private _location: Location,
    private _router: Router,
    private _toastService: ToastService,
    private _deviceService: DeviceService,
    private _telemService: TelemetryService
  ) {
    this.submitted = false;
    this.deviceAdded = false;
    this.brokers = [];
    this.topics = [];
    this.classes = [];
    this.selectedBroker = null;
    this.selectedStatusTopic = null;
    this.selectedControlTopic = null;
    this.selectedClass = null;
    this.form = this._fb.group({
      name: ['', [Validators.required]],
      friendlyName: [''],
      broker: ['', [Validators.required]],
      statusTopic: ['', [Validators.required]],
      controlTopic: [''],
      deviceClass: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this._telemService.getBrokers().subscribe({
      next: value => this.brokers = value
    });

    this._deviceService.getDeviceClasses().subscribe({
      next: value => this.classes = value
    });
  }

  onBackClick(): void {
    this._location.back();
  }

  isFieldValid(field: string): boolean {
    let fld = this.form.get(field);
    return !!fld && !fld.valid && fld.touched;
  }

  checkForFormErrors(form: UntypedFormGroup): boolean {
    form.markAllAsTouched();

    let returnValue = false;
    for (const prop in form.controls) {
      if (form.controls[prop].errors !== null) {
        returnValue = true;
      }
    }

    if (!!returnValue) {
      this._toastService.setErrorMessage();
    }

    return returnValue;
  }

  onSelectBroker(): void {
    let broker = this.form.get('broker');
    if (broker) {
      this.selectedBroker = broker.value as MqttBroker;
      this._telemService.getTopicsForBroker(this.selectedBroker.id).subscribe({
        next: value => this.topics = value
      });
    }
  }

  onSelectStatusTopic(): void {
    let stat = this.form.get('statusTopic');
    if (stat) {
      this.selectedStatusTopic = stat.value as MqttTopic;
    }
  }

  onSelectControlTopic(): void {
    let ctrl = this.form.get('controlTopic');
    if (ctrl) {
      this.selectedControlTopic = ctrl.value as MqttTopic;
    }
  }

  onSelectClass(): void {
    let klass = this.form.get('deviceClass');
    this.selectedClass = klass?.value;
  }

  submit(): void {
    if (this.checkForFormErrors(this.form)) {
      return;
    }

    this.submitted = true;

    let dev = {
      name: this.form.value.name,
      friendlyName: this.form.value.friendlyName,
      statusTopicId: this.form.value.statusTopic.id,
      controlTopicId: this.form.value.controlTopic?.id,
      isActive: true,
      class: this.form.value.deviceClass
    } as Device;

    this._deviceService.saveDevice(dev)
      .pipe(take(1))
      .subscribe({
        next: value => {
          if (value !== null) {
            this.deviceAdded = true;
            this._toastService.setSuccessMessage("Success!");
            setTimeout(() => { this._router.navigate(['/device-management']); }, 2000);
          }
          else {
            this.deviceAdded = false;
            this._toastService.setErrorMessage("Unable to save device! Make sure duplicate does not exist!");
          }
        }
      });
  }
}
