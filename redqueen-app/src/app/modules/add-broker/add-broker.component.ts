import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TelemetryService } from 'src/app/core/services/telemetry.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { MqttBroker } from 'src/app/core/interfaces/mqtt-broker';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-broker',
  templateUrl: './add-broker.component.html',
  styleUrls: ['./add-broker.component.scss']
})
export class AddBrokerComponent implements OnInit {
  form: FormGroup;
  shouldUseTls: boolean = false;
  brokerAdded: boolean = false;
  submitted: boolean = false;

  constructor(
    private _telemService: TelemetryService,
    private _fb: FormBuilder,
    private _toastService: ToastService,
    private _location: Location,
    private _router: Router
  ) {
    this.form = this._fb.group({
      host: ['', [Validators.required]],
      port: [1883, [Validators.required]],
      username: [''],
      password: [''],
      useTls: [false, [Validators.required]],
      keepAliveSeconds: [null],
      discoveryTopic: ['']
    });
  }

  ngOnInit(): void {
  }

  isFieldValid(field: string): boolean {
    const fld = this.form.get(field);
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

  onBackClick(): void {
    this._location.back();
  }

  onUseTlsCheckChange(e: Event): void {
    this.shouldUseTls = (e.target as HTMLInputElement).checked;
  }

  submit(): void {
    if (this.checkForFormErrors(this.form)) {
      return;
    }

    this.submitted = true;

    const broker = this.form.value as MqttBroker;
    this._telemService.addBroker(broker)
      .pipe(take(1))
      .subscribe(value => {
        if (value) {
          this.brokerAdded = true;
          this._toastService.setSuccessMessage("Success!");
          setTimeout(() => this._router.navigate(['/broker-management']), 2000);
        }
        else {
          this.brokerAdded = false;
          this._toastService.setErrorMessage("Unable to add broker! Check broker does not already exist!");
        }
      });
  }
}
