import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

currView = "login"

  constructor(public authService: AuthServiceService) {
    
  }

  ngOnInit() {
  }

  setMenu(view){
    this.currView = view
  }

}
