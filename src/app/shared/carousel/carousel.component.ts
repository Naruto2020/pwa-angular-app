import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
  @Input() title: string = '';
  @Input() items: any[] = [];
  @Input() context: 'default' | 'public stolen' | 'private stolen' = 'default';
  @Input() baseRoute?: string;

  @Output() itemClicked = new EventEmitter<any>();

  constructor(private router: Router) {}

  onItemClick(item: any) {
    // ⚡ Émettre l'événement pour le parent
    this.itemClicked.emit({ item, context: this.context });

    // Navigation si nécessaire pour d'autres cas
    if (this.context !== 'public stolen' && this.baseRoute) {
      this.router.navigate([this.baseRoute, item.id]);
    }
  }
}

