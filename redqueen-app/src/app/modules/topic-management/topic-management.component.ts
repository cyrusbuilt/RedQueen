import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MqttBroker } from 'src/app/core/interfaces/mqtt-broker';
import { MqttTopic } from 'src/app/core/interfaces/mqtt-topic';
import { TelemetryService } from 'src/app/core/services/telemetry.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-topic-management',
  templateUrl: './topic-management.component.html',
  styleUrls: ['./topic-management.component.scss']
})
export class TopicManagementComponent implements OnInit {
  topics: MqttTopic[];
  brokers: MqttBroker[];

  constructor(
    private _router: Router,
    private _telemService: TelemetryService,
    private _toastService: ToastService
  ) {
    this.topics = [];
    this.brokers = [];
  }

  refreshData(): void {
    this._telemService.getTopics().subscribe({
      next: value => {
        this.topics = value;
        this.topics.forEach(t => {
          this._telemService.getBrokerById(t.brokerId).subscribe({
            next: broker => {
              if (broker) {
                this.brokers.push(broker);
              }
            }
          });
        });
      }
    });
  }

  getBrokerNameForTopic(topic: MqttTopic): string {
    let broker = this.brokers.find(b => b.id == topic.brokerId);
    if (broker) {
      return broker.host;
    }

    return "";
  }

  ngOnInit(): void {
    this.refreshData();
  }

  activateOrDeactivateTopic(topic: MqttTopic): void {
    topic.isActive = !topic.isActive;
    this._telemService.updateTopic(topic.id, topic).subscribe({
      next: value => {
        if (value != null) {
          this.refreshData();
        }
        else {
          this._toastService.setErrorMessage("Topic update failed!");
        }
      }
    });
  }

  addTopic(): void {
    this._router.navigate(['/topic-management/add']);
  }
}
