import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/auth/components/services/login.service';

@Component({
  selector: 'app-profile-drop-down',
  templateUrl: './profile-drop-down.component.html',
  styleUrls: ['./profile-drop-down.component.scss']
})
export class ProfileDropDownComponent implements OnInit {

  userF = ''

  constructor(private loginService: LoginService,) { }

  ngOnInit(): void {
    const token = this.loginService.getToken();
    const userInfo = this.loginService.getUserInfo()
    if (userInfo && userInfo.firstName) {
      this.userF = userInfo.firstName;
    }
  }
  logout() {
    this.loginService.logout()
  }

}
