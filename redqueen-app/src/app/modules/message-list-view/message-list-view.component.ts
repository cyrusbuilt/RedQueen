import { Component, OnDestroy, OnInit } from '@angular/core';
import { MqttMessage } from 'src/app/core/interfaces/mqtt-message';
import { TelemetryService } from 'src/app/core/services/telemetry.service';

@Component({
  selector: 'app-message-list-view',
  templateUrl: './message-list-view.component.html',
  styleUrls: ['./message-list-view.component.scss']
})
export class MessageListViewComponent implements OnInit, OnDestroy {
  private _interval: any;
  messages: MqttMessage[];
  curPage: number;
  pageSize: number;
  totalEntries: number;

  constructor(
    private _telemService: TelemetryService
  ) {
    this.messages = [];
    this.curPage = 1;
    this.pageSize = 10;
    this.totalEntries = 0;
  }

  getMessages(): void {
    this._telemService.getMessages(this.pageSize, this.curPage).subscribe({
      next: value => {
        this.totalEntries = value.recordCount;
        this.messages = value.items;
        this.curPage = value.pageNumber;
        this.pageSize = value.pageSize;
      }
    });
  }

  ngOnInit(): void {
    this.getMessages();
    this._interval = setInterval(() => this.getMessages(), 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this._interval);
  }

  handlePageChange(event: number): void {
    this.curPage = event;
    this.getMessages();
  }
}
