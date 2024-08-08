import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Advertisement } from 'src/app/Data Transfer Objects/Advertisements';

@Component({
  selector: 'app-advertisement-card',
  templateUrl: './advertisement-card.component.html',
  styleUrls: ['./advertisement-card.component.scss']
})
export class AdvertisementCardComponent {
  @Input() card: any;
  @Output() cardClick = new EventEmitter<Advertisement>();

  onCardClick() {
    this.cardClick.emit(this.card);
  }
}
