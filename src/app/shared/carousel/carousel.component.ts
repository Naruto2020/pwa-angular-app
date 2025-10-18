import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  @Input() title: string = '';
  @Input() items: any[] = [];
  @Input() baseRoute?: string; // If provide → navigation
  @Input() context: 'default' | 'public stolen' | 'private stolen' = 'default'; // "stolen" = produits volés

  constructor(private router: Router) {}

  ngOnInit(): void {
  }


  onItemClick(item: any) {
    if (this.context === 'public stolen') {
      alert("🛡️ Connectez-vous à TEIK pour obtenir plus d’informations sur ce produit !");
    } else if (this.baseRoute) {
      this.router.navigate([this.baseRoute, item.id]);
    }
  }


}
