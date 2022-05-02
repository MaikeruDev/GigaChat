import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavigationExtras, Router } from '@angular/router';
import { PlatformService } from '../services/platform.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public db: AngularFirestore, public router: Router, public platformService: PlatformService,) {}

  chatsList = [{id: 123, first_name: "Mathias", last_name: "Johannsen", email: "mathias@johannsen.xyz", avatar: "https://hszteam.de/wp-content/uploads/2021/01/avatar-placeholder.gif", last_message: "amogus"},{id: 123, first_name: "Mathias", last_name: "Johannsen", email: "mathias@johannsen.xyz", avatar: "https://hszteam.de/wp-content/uploads/2021/01/avatar-placeholder.gif", last_message: "amogus"},{id: 123, first_name: "Mathias", last_name: "Johannsen", email: "mathias@johannsen.xyz", avatar: "https://hszteam.de/wp-content/uploads/2021/01/avatar-placeholder.gif", last_message: "amogus"},{id: 123, first_name: "Mathias", last_name: "Johannsen", email: "mathias@johannsen.xyz", avatar: "https://hszteam.de/wp-content/uploads/2021/01/avatar-placeholder.gif", last_message: "amogus"}]

  async openChat(chat){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(chat)
      },
      replaceUrl: true
    };
    this.router.navigate(['chat'], navigationExtras);
  }

}
