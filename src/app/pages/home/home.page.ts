import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { PlatformService } from '../../services/platform.service';
import { NewChatPage } from '../new-chat/new-chat.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public authService: AuthServiceService, public modalController: ModalController, public db: AngularFirestore, public router: Router, public platformService: PlatformService,) {}

  chatsList = [{cid: "5RC14gRWLT4DUZwMESIz", name: "Mathias Johannsen", email: "mathias@johannsen.xyz", avatar: "https://hszteam.de/wp-content/uploads/2021/01/avatar-placeholder.gif", last_message: "amogus"}]

  uid: any;

  async ngOnInit() {
    this.authService.userDetails().subscribe(async (user: any) => {
      this.uid = user.uid
      this.db.collection('users').doc(this.uid).ref.onSnapshot(async (me: any) => {
        var chats = me.data().chats
        chats.forEach(chat => {
          this.db.collection('chats').doc(chat).ref.get().then(async (_chat: any) => {
            var chat = _chat.data();
            chat.cid = _chat.id;
            _chat.data().users.forEach(chatUser => {
              if(chatUser != this.uid){
                this.db.collection('users').doc(chatUser).ref.get().then(async (otherUser: any) => {
                  chat.name = otherUser.data().name
                  chat.email = otherUser.data().email
                  chat.avatar = otherUser.data().pfp
                  chat.ouid = otherUser.data().uid
                })
              }
            });
            this.chatsList.push(chat)
          })
        });
      })
    })
  }

  async openChat(chat){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        chat: JSON.stringify(chat)
      },
      replaceUrl: true
    };
    this.router.navigate(['chat'], navigationExtras);
  }

  async newChat(){
    const modal = await this.modalController.create({
      component: NewChatPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

}
