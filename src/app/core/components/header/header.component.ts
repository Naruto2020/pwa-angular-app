import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';
import { LoginService } from '../../../auth/components/services/login.service';
import { UserService } from '../../../user/components/services/user.service.ts.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  dropdownVisible = false;
  private unsubscribe$ = new Subject<void>();

  userImageUrl!: string;
  currentUserPhoto!: SafeUrl;

  constructor(private router: Router, private userService: UserService, 
    private sanitizer: DomSanitizer, private loginService: LoginService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    const userId = this.loginService.getUserInfo().userId;
    if (!userId) {
      return
    } else {
      this.userService.getCurrentUser(userId).pipe(
        tap(data => {
          if(data) {
            this.currentUserPhoto = this.sanitizer.bypassSecurityTrustUrl(data.profilPhoto);
          }
        }),
        catchError(error => {
          console.error('Error fetching user data:', error);
          return of(null); 
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe();
    }

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
