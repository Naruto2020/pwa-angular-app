import { Component, OnInit } from '@angular/core';
import { LostProduct } from '@app/network/models/lostProduct.model';
import { SquadService } from '@app/network/services/squad.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-squad',
  templateUrl: './squad.component.html',
  styleUrls: ['./squad.component.scss']
})
export class SquadComponent implements OnInit {

  // Search field
  selectedBrand: string = '';
  serialNumber: string = '';

  // Select brand list avaiable 
  brands: string[] = ['JORDAN', 'Hermes', 'Louis Vuitton', 'PATEK PHILIPPE'];

  // Produits perdus
  lostProducts = [
    {
      id: 1,
      serialNumber: 'A100235',
      shortSerial: 'Numéro: ...235',
      brand: 'JORDAN',
      model: 'JordanAIR 11 RETRO',
      authenticator: 'LegitGrails',
      ownerName: 'Steve Kounga',
      lossDate: '2025-10-10T00:00:00Z',
      lossCity: 'Paris',
      lossCountry: 'France',
      insured: false,
      complaintFiled: false,
      imageUrl: 'assets/images/jordan-retro.png',
    },
    {
      id: 2,
      serialNumber: 'B784523',
      shortSerial: 'Numéro: ...523',
      brand: 'Hermes',
      model: 'Sac Évelyne III 29',
      authenticator: 'Entrupy',
      ownerName: 'Marie Claire',
      lossDate: '2025-10-15T00:00:00Z',
      lossCity: 'Lyon',
      lossCountry: 'France',
      insured: true,
      complaintFiled: false,
      imageUrl: 'assets/images/hermes-b.png',
    },
    {
      id: 3,
      serialNumber: 'C784987',
      shortSerial: 'Numéro: ...987',
      brand: 'Louis Vuitton',
      model: 'Sac Neverfull GM',
      authenticator: 'Entrupy',
      ownerName: 'Kazy',
      lossDate: '2025-10-18T00:00:00Z',
      lossCity: 'Tokyo',
      lossCountry: 'Japan',
      insured: false,
      complaintFiled: true,
      imageUrl: 'assets/images/louisV-n.png',
    },
    {
      id: 4,
      serialNumber: 'P784549',
      shortSerial: 'Numéro: ...549',
      brand: 'PATEK PHILIPPE',
      model: 'MONTRE QUANTIÈME ANNUEL 5035R.',
      authenticator: 'PATEK',
      ownerName: 'Luc Perry',
      lossDate: '2025-10-25T00:00:00Z',
      lossCity: 'New York',
      lossCountry: 'USA',
      insured: true,
      complaintFiled: true,
      imageUrl: 'assets/images/patek-p.png',
    },
  ];

  // Produits filtrés pour le carousel
  filteredProducts = [...this.lostProducts];
  //filteredProducts: LostProduct[] = [];
  lostProductsP: LostProduct[] =  [];

  baseRoute = '/teik/products/current-product';

  constructor(private squadService: SquadService) { }

  ngOnInit(): void {
    this.getPrivateLostProduct();
  }

  private getPrivateLostProduct(): void {
    this.squadService.getAllPrivateLostProduct().pipe(
      tap(
        privateProducts => {
          if(privateProducts) {
            this.lostProductsP = privateProducts;
            //this.filteredProducts = [...this.lostProductsP];
            console.log('test ==> : ', this.lostProductsP)
          }
        }
      )
    ).subscribe();
  }
  

  // Filtering by brand and serial number
  onSearchChange() {
    this.filteredProducts = this.lostProducts.filter(p =>
      (!this.selectedBrand || p.brand === this.selectedBrand) &&
      (!this.serialNumber || p.serialNumber?.includes(this.serialNumber))
    );
  }

  clearBrand() {
    this.selectedBrand = '';
    this.onSearchChange();
  }

  clearSerialNumber() {
    this.serialNumber = '';
    this.onSearchChange();
  }

}
