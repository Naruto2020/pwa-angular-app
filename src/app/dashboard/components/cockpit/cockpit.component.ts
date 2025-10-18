import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../auth/components/services/login.service';

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.scss']
})
export class CockpitComponent implements OnInit {

  constructor(private loginService: LoginService) { }
  currentUserId!: string;
  currentUserLastName!: string;
  currentUserFirstName!: string;
  currentUserCompanie!: string;
  currentUserCity!: string;
  currentUserCountry!: string;

  // Consumer data
  userScanCount = 37;
  userAuthCount = 29;
  userReportedProducts = 3;
  userReportedTheft = 1;
  authenticityScore = 0; // Calculated

  ngOnInit(): void {
    const userId = this.loginService.getUserInfo().userId;
    if(!userId) return;
    this.currentUserId = userId;
    this.currentUserLastName = this.loginService.getUserInfo().lastName ?? '';
    this.currentUserFirstName = this.loginService.getUserInfo().firstName ?? '';
    this.currentUserCompanie = this.loginService.getUserInfo().companie ?? '';

    this.calculateAuthenticityScore(); 
  }

  // Company data
  createdProductsCount = 124;
  expiredProducts = 9;
  totalScans = 845;
  authenticityRate = 92;
  flaggedProductsCount = 7;
  activeUsersCount = 48;
  consumerOfTheMonthName = "Jean K.";


  calculateAuthenticityScore() {
    const S = this.userScanCount;
    const A = this.userAuthCount;
    const C = this.userReportedProducts;
    const T = this.userReportedTheft;

    const base = S === 0 ? 0 : (A / S) * 100;
    const penalty = (5 * C) + (10 * T);
    this.authenticityScore = Math.max(0, Math.min(100, Math.round(base - penalty)));
  }
  userBadges = ['Détective', 'Anti-fake', 'Premium'];

}
