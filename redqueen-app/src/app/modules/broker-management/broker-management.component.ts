import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MqttBroker } from 'src/app/core/interfaces/mqtt-broker';
import { TelemetryService } from 'src/app/core/services/telemetry.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-broker-management',
  templateUrl: './broker-management.component.html',
  styleUrls: ['./broker-management.component.scss']
})
export class BrokerManagementComponent implements OnInit {
  brokers: MqttBroker[];

  constructor(
    private _telemService: TelemetryService,
    private _toastService: ToastService,
    private _router: Router
  ) {
    this.brokers = [];
  }

  getBrokers(): void {
    this._telemService.getBrokers().subscribe({
      next: value => this.brokers = value
    });
  }

  ngOnInit(): void {
    this.getBrokers();
  }

  activateOrDeactivateBroker(broker: MqttBroker): void {
    broker.isActive = !broker.isActive;
    this._telemService.updateBroker(broker.id, broker).subscribe({
      next: value => {
        if (value != null) {
          this.getBrokers();
        }
        else {
          this._toastService.setErrorMessage("Failed to update broker!");
        }
      }
    });
  }

  addBroker(): void {
    this._router.navigate(['/broker-management/add']);
  }

  editBroker(broker: MqttBroker): void {
    sessionStorage.setItem('manageBroker', JSON.stringify(broker));
    this._router.navigate(['/broker-management/edit']);
  }
}
