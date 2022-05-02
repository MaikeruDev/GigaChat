import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  activeTab: string = 'chats'

  constructor(public db: AngularFirestore, public router: Router) {}

  segmentChange(e){
    this.activeTab = e.target.value;
  }

  async openChat(chat){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(chat)
      }
    };
    this.router.navigate(['chat'], navigationExtras);
  }

}
