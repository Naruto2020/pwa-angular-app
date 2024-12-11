import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { ProfileDropDownComponent } from '../profile-drop-down/profile-drop-down.component';
import { UserService } from '../../../user/components/services/user.service.ts.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LoginService } from '../../../auth/components/services/login.service';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';


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
      //console.log('testons ')
      //window.location.reload();
      return
    } else {
      //console.log("arg ---> : ", userId);
      this.userService.getCurrentUser(userId).pipe(
        tap(data => {
          if(data) {
            //this.userImageUrl = data.profilPhoto;
            this.currentUserPhoto = this.sanitizer.bypassSecurityTrustUrl(data.profilPhoto);
            console.log('testons ', this.currentUserPhoto)
            // if (!isReloaded) {
            //   sessionStorage.setItem('isReloaded', 'true'); // Marque la page comme rechargée
            //   window.location.reload();
            //   console.log('testons ', isReloaded)
            // }
          }
        }),
        catchError(error => {
          console.error('Error fetching user data:', error);
          return of(null); 
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe();
    }
    // const isReloaded = sessionStorage.getItem('isReloaded');
    // if (!isReloaded) {
    //   console.log('testons ', isReloaded)
    //   sessionStorage.setItem('isReloaded', 'true');
    //   window.location.reload();
    //   this.userService.getCurrentUser(userId).pipe(
    //     tap(data => {
    //       if(data) {
    //         this.userImageUrl = data.profilPhoto;
    //         this.currentUserPhoto = this.sanitizer.bypassSecurityTrustUrl(this.userImageUrl);
    //         // if (!isReloaded) {
    //         //   sessionStorage.setItem('isReloaded', 'true'); // Marque la page comme rechargée
    //         //   window.location.reload();
    //         //   console.log('testons ', isReloaded)
    //         // }
    //       }
    //     }),
    //     catchError(error => {
    //       console.error('Error fetching user data:', error);
    //       return of(null); 
    //     }),
    //     takeUntil(this.unsubscribe$)
    //   ).subscribe();
    // }
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
