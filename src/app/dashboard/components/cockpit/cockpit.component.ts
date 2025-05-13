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

}
