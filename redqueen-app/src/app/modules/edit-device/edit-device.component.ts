import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Device } from 'src/app/core/interfaces/device';
import { DeviceService } from 'src/app/core/services/device.service';
import { MqttBroker } from 'src/app/core/interfaces/mqtt-broker';
import { MqttTopic } from 'src/app/core/interfaces/mqtt-topic';
import { TelemetryService } from 'src/app/core/services/telemetry.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss']
})
export class EditDeviceComponent implements OnInit {
  submitted: boolean;
  saved: boolean;
  form: FormGroup;
  device: Device | null;
  brokers: MqttBroker[];
  topics: MqttTopic[];
  classes: string[];
  selectedBroker: MqttBroker | null;
  selectedStatusTopic: MqttTopic | null;
  selectedControlTopic: MqttTopic | null;
  selectedClass: string | null;

  constructor (
    private _fb: FormBuilder,
    private _location: Location,
    private _router: Router,
    private _deviceService: DeviceService,
    private _telemService: TelemetryService,
    private _toastService: ToastService
  ) {
    this.device = null;
    this.submitted = false;
    this.saved = false;
    this.brokers = [];
    this.topics = [];
    this.classes = [];
    this.selectedBroker = null;
    this.selectedStatusTopic = null;
    this.selectedControlTopic = null;
    this.selectedClass = null;
    this.form = this._fb.group({
      name: ['', [Validators.required]],
      statusTopic: ['', [Validators.required]],
      controlTopic: [''],
      broker: ['', [Validators.required]],
      deviceClass: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this._deviceService.getDeviceClasses().subscribe({
      next: value => this.classes = value
    });

    this._telemService.getBrokers().subscribe({
      next: value => {
        this.brokers = value;
        let dev = sessionStorage.getItem('manageDevice');
        if (dev) {
          this.device = JSON.parse(dev) as Device;
          this.form.controls['name'].setValue(this.device.name);
          this.form.controls['deviceClass'].setValue(this.device.class);

          let sb = this.brokers.find(b => b.id === this.device?.statusTopic?.brokerId);
          if (sb) {
            this.form.controls['broker'].setValue(sb);
            this.selectedBroker = sb;
            this._telemService.getTopicsForBroker(this.selectedBroker.id).subscribe({
              next: value => {
                this.topics = value;
                let sst = this.topics.find(t => t.id === this.device?.statusTopicId);
                if (sst) {
                  this.selectedStatusTopic = sst;
                  this.form.controls['statusTopic'].setValue(sst);
                }

                let sct = this.topics.find(t => t.id === this.device?.controlTopicId);
                if (sct) {
                  this.selectedControlTopic = sct;
                  this.form.controls['controlTopic'].setValue(sct);
                }
              }
            });
          }
        }
      }
    });
  }

  isFieldValid(field: string): boolean {
    let fld = this.form.get(field);
    return !!fld && !fld.valid && fld.touched;
  }

  checkForFormErrors(form: FormGroup): boolean {
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
    if (!this.device || this.checkForFormErrors(this.form)) {
      return;
    }

    this.submitted = true;
    this.device.name = this.form.value.name;
    this.device.statusTopicId = this.form.value.statusTopic.id;
    this.device.controlTopicId = this.form.value.controlTopic?.id;
    this.device.class = this.form.value.deviceClass;

    this._deviceService.updateDevice(this.device.id, this.device)
      .pipe(take(1))
      .subscribe({
        next: value => {
          if (value !== null) {
            this.saved = true;
            this._toastService.setSuccessMessage("Saved!");
            sessionStorage.setItem('manageDevice', '');
            setTimeout(() => { this._router.navigate(['/device-management']); }, 2000);
          }
          else {
            this.saved = false;
            this._toastService.setErrorMessage("Failed to save device!");
          }
        }
      });
  }

  onBackClick(): void {
    this._location.back();
  }
}
