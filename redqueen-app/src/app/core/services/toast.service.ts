import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor() { }

  private _toastMessage = new BehaviorSubject<string>('');

  toastElement: HTMLElement | null = document.getElementById('toast');
  showTime: number = 5000;

  get toastMessage() {
    return this._toastMessage.asObservable();
  }

  setErrorMessage(message: string = ''): void {
    if (message === '') {
      message = 'Something went wrong. Please correct the highlighted fields below.';
    }

    this._toastMessage.next(message);
    const toast = document.getElementById('toast');
    if (toast) {
      toast.classList.remove('success');
      toast.classList.add('error');
      if (!toast.classList.contains('open')) {
        toast.classList.add('open');
        window.setTimeout(function () {
          toast.classList.remove('open');
          toast.classList.remove('success');
          toast.classList.remove('error');
        }, this.showTime);
      }
    }
  }

  setSuccessMessage(message: string): void {
    this._toastMessage.next(message);

    const toast = document.getElementById('toast');
    if (toast) {
      toast.classList.remove('error');
      toast.classList.add('success');

      if (!toast.classList.contains('open')) {
        toast.classList.add('open');
        window.setTimeout(function () {
          toast.classList.remove('open');
          toast.classList.remove('success');
          toast.classList.remove('error');
        }, this.showTime);
      }
    }
  }

  removeMessage(): void {
    const toast = document.getElementById('toast');
    if (!!toast) {
      toast.classList.remove('open');
      toast.classList.remove('success');
      toast.classList.remove('error');
    }
  }
}
