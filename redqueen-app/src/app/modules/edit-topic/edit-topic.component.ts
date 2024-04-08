import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { MqttTopic } from 'src/app/core/interfaces/mqtt-topic';
import { TelemetryService } from 'src/app/core/services/telemetry.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-edit-topic',
  templateUrl: './edit-topic.component.html',
  styleUrls: ['./edit-topic.component.scss']
})
export class EditTopicComponent implements OnInit {
  form: UntypedFormGroup;
  saved: boolean;
  submitted: boolean;
  topic: MqttTopic | null;

  constructor(
    private _fb: UntypedFormBuilder,
    private _router: Router,
    private _location: Location,
    private _toastService: ToastService,
    private _telemService: TelemetryService
  ) {
    this.saved = false;
    this.submitted = false;
    this.topic = null;
    this.form = this._fb.group({
      name: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const tpk = sessionStorage.getItem('manageTopic');
    if (tpk) {
      this.topic = JSON.parse(tpk) as MqttTopic;
      this.form.controls['name'].setValue(this.topic.name);
    }
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
    if (!this.topic || this.checkForFormErrors(this.form)) {
      return;
    }

    this.submitted = true;

    this.topic.name = this.form.value.name;
    this._telemService.updateTopic(this.topic.id, this.topic)
      .pipe(take(1))
      .subscribe({
        next: value => {
          if (value !== null) {
            this.saved = true;
            this._toastService.setSuccessMessage("Saved!");
            sessionStorage.setItem('manageTopic', '');
            setTimeout(() => { this._router.navigate(['/topic-management']); }, 2000);
          }
          else {
            this.saved = false;
            this._toastService.setErrorMessage('Failed to save topic!');
          }
        }
      });
  }

  onBackClick(): void {
    this._location.back();
  }
}
