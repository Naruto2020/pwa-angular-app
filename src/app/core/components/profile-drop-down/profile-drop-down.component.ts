import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-drop-down',
  templateUrl: './profile-drop-down.component.html',
  styleUrls: ['./profile-drop-down.component.scss']
})
export class ProfileDropDownComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  logout() {
    // Implémentez ici la logique de déconnexion de l'utilisateur
  }

}
