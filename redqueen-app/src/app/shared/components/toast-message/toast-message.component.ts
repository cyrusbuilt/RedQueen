import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService } from 'src/app/core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-message',
  templateUrl: './toast-message.component.html',
  styleUrls: ['./toast-message.component.scss']
})
export class ToastMessageComponent implements OnInit, OnDestroy {
  toastMessage!: string;
  toastServiceSubscription$!: Subscription;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastServiceSubscription$ = this.toastService.toastMessage.subscribe({
      next: message => this.toastMessage = message
    });
  }

  ngOnDestroy(): void {
    this.toastServiceSubscription$.unsubscribe();
  }
}

