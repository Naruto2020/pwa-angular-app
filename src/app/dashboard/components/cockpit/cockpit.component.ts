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

  ngOnInit(): void {
    const userId = this.loginService.getUserInfo().userId;
    if(!userId) return;
    this.currentUserId = userId;
    this.currentUserLastName = this.loginService.getUserInfo().lastName ?? '';
    this.currentUserFirstName = this.loginService.getUserInfo().firstName ?? '';
    this.currentUserCompanie = this.loginService.getUserInfo().companie ?? '';
  }

  // Company data
  createdProductsCount = 124;
  expiredProducts = 9;
  totalScans = 845;
  authenticityRate = 92;
  flaggedProductsCount = 7;
  activeUsersCount = 48;
  consumerOfTheMonthName = "Jean K.";

  // Consumer data
  userScanCount = 37;
  userValidScanCount = 29;
  userReportedProducts = 3;
  authenticityScore = 82; // Calculated
  cashbackScore = 500; // Calculated
  userBadges = ['Détective', 'Anti-fake', 'Premium'];

}
