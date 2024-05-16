import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { ProfileDropDownComponent } from '../profile-drop-down/profile-drop-down.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  dropdownVisible = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
    const headerContainer = document.getElementById('headerContainer');
    if (headerContainer) {
        if (this.dropdownVisible) {
            headerContainer.classList.add('open');
        } else {
            headerContainer.classList.remove('open');
        }
    }
  }

  isLoginPage(): boolean {
    return this.router.url === '/teik/auth/login';
  }

  isRegisterPage(): boolean {
    return this.router.url === '/teik/auth/register';
  }


}
