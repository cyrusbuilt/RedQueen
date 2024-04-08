import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { MqttBroker } from 'src/app/core/interfaces/mqtt-broker';
import { MqttTopic } from 'src/app/core/interfaces/mqtt-topic';
import { TelemetryService } from 'src/app/core/services/telemetry.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-add-topic',
  templateUrl: './add-topic.component.html',
  styleUrls: ['./add-topic.component.scss']
})
export class AddTopicComponent implements OnInit {
  brokers: MqttBroker[];
  form: UntypedFormGroup;
  selectedBroker: MqttBroker | null;
  submitted: boolean;
  topicAdded: boolean;

  constructor(
    private _location: Location,
    private _router: Router,
    private _toastService: ToastService,
    private _telemService: TelemetryService,
    private _fb: UntypedFormBuilder
  ) {
    this.topicAdded = false;
    this.submitted = false;
    this.selectedBroker = null;
    this.brokers = [];
    this.form = this._fb.group({
      broker: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (window.history.state.brokers) {
      this.brokers = window.history.state.brokers as MqttBroker[];
    }
    else {
      this._telemService.getBrokers().subscribe({
        next: value => this.brokers = value
      });
    }
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

  submit(): void {
    if (this.checkForFormErrors(this.form)) {
      return;
    }

    this.submitted = true;

    let topic = {
      name: this.form.value.name,
      brokerId: this.form.value.broker.id,
      isActive: true
    } as MqttTopic;

    this._telemService.addTopic(topic)
      .pipe(take(1))
      .subscribe(value => {
        if (value) {
          this.topicAdded = true;
          this._toastService.setSuccessMessage("Success!");
          setTimeout(() => { this._router.navigate(['/topic-management'])}, 2000);
        }
        else {
          this.topicAdded = false;
          this._toastService.setErrorMessage("Unable to add topic! Make sure topic does not already exist!");
        }
      });
  }

  onSelectBroker(): void {
    let brkr = this.form.get('broker');
    if (brkr) {
      this.selectedBroker = brkr.value as MqttBroker;
    }
  }
}
