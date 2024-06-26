import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from 'src/app/core/interfaces/card';
import { CardService } from 'src/app/core/services/card.service';

@Component({
  selector: 'app-card-management',
  templateUrl: './card-management.component.html',
  styleUrls: ['./card-management.component.scss']
})
export class CardManagementComponent implements OnInit {
  cards: Card[];
  curPage: number;
  pageSize: number;
  totalEntries: number;

  constructor(
    private _router: Router,
    private _cardService: CardService
  ) {
    this.cards = [];
    this.curPage = 1;
    this.pageSize = 10;
    this.totalEntries = 0;
  }

  getCards(): void {
    this._cardService.getCards(this.pageSize, this.curPage).subscribe({
      next: value => {
        this.totalEntries = value.recordCount;
        this.cards = value.items;
        this.curPage = value.pageNumber;
        this.pageSize = value.pageSize;
      }
    });
  }

  ngOnInit(): void {
    this.getCards();
  }

  handlePageChange(event: number) {
    this.curPage = event;
    this.getCards();
  }

  onAddCard(): void {
    this._router.navigate(['/card-management/add']);
  }

  onManageClick(card: Card) {
    sessionStorage.setItem('manageCard', JSON.stringify(card));
    this._router.navigate(['/card-management/manage-card']);
  }

  onManageUsersClick(): void {
    this._router.navigate(['/card-management/access-control-user-management']);
  }
}
