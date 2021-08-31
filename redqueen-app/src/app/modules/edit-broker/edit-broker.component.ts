import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { MqttBroker } from 'src/app/core/interfaces/mqtt-broker';
import { TelemetryService } from 'src/app/core/services/telemetry.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-edit-broker',
  templateUrl: './edit-broker.component.html',
  styleUrls: ['./edit-broker.component.scss']
})
export class EditBrokerComponent implements OnInit {
  broker: MqttBroker | null;
  saved: boolean;
  submitted: boolean;
  shouldUseTls: boolean;
  form: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _location: Location,
    private _telemService: TelemetryService,
    private _toastService: ToastService
  ) {
    this.broker = null;
    this.saved = false;
    this.submitted = false;
    this.shouldUseTls = false;
    this.form = this._fb.group({
      host: ['', Validators.required],
      port: [1883, Validators.required],
      username: [''],
      password: [''],
      useTls: [false, Validators.required],
      keepAliveSeconds: [null]
    });
  }

  ngOnInit(): void {
    const brk = sessionStorage.getItem('manageBroker');
    if (brk) {
      this.broker = JSON.parse(brk);
      this.form.controls['host'].setValue(this.broker?.host);
      this.form.controls['port'].setValue(this.broker?.port);
      this.form.controls['username'].setValue(this.broker?.username);
      this.form.controls['password'].setValue(this.broker?.password);
      this.form.controls['useTls'].setValue(this.broker?.useTls);
      this.form.controls['keepAliveSeconds'].setValue(this.broker?.keepAliveSeconds);
    }
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

  submit(): void {
    if (!this.broker || this.checkForFormErrors(this.form)) {
      return;
    }

    this.submitted = true;

    const broker = this.form.value as MqttBroker;
    this.broker.host = broker.host;
    this.broker.port = broker.port;
    this.broker.username = broker.username;
    this.broker.password = broker.password;
    this.broker.useTls = broker.useTls;
    this.broker.keepAliveSeconds = broker.keepAliveSeconds;

    this._telemService.updateBroker(this.broker.id, this.broker)
      .pipe(take(1))
      .subscribe({
      next: value => {
        if (value !== null) {
          this.saved = true;
          this._toastService.setSuccessMessage("Saved!");
          sessionStorage.setItem('manageBroker', '');
          setTimeout(() => { this._router.navigate(['/broker-management']); }, 2000);
        }
        else {
          this.saved = false;
          this._toastService.setErrorMessage("Failed to save broker!");
        }
      }
    });
  }

  onUseTlsCheckChanged(e: Event): void {
    this.shouldUseTls = (e.target as HTMLInputElement).checked;
  }

  onBackClick(): void {
    this._location.back();
  }
}
