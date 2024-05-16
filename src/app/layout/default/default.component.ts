import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  showHeader: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        const currentRoute = this.router.routerState.snapshot.root;
        this.showHeader = this.shouldShowHeader(currentRoute);
      }
    });
  }

  shouldShowHeader(route: ActivatedRouteSnapshot): boolean {
    if(route.firstChild) {
      return this.shouldShowHeader(route.firstChild);
    }
    return route.data['showHeader'] !== false;
  }

}
