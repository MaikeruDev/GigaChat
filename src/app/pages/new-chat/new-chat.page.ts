import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.page.html',
  styleUrls: ['./new-chat.page.scss'],
})
export class NewChatPage implements OnInit {

  constructor(public authService: AuthServiceService, public platformService: PlatformService, public modalController: ModalController, public db: AngularFirestore) { }

  foundUsers = []
  uid;

  ngOnInit() {
    this.authService.userDetails().subscribe(async (user: any) => {
      this.uid = user.uid
    })
  }

  search(query) {
    if (!query) { // revert back to the original array if no query
      this.foundUsers = []
    } 
    else { // filter array by query
      this.db.collection('users').ref.where('name', '>=', query).where('name', '<=', query+ '\uf8ff').limit(10).get().then(async (res: any) => {
        this.foundUsers = []
        res.forEach(user => {
          console.log(user.uid, this.uid)
          if(user.id != this.uid){
            this.foundUsers.push(user.data())
          }
        });
      })
    }
  }

  startChat(user){
    var users = [user.uid, this.uid]
    this.db.collection('chats').add({
      last_message: "",
      users: [this.uid, user.uid]
    }).then(async (docRef: any) => {
      users.forEach(_user => {
        this.db.collection('users').doc(_user).set({
          chats: [docRef.id]
        }, {merge: true})
      })
    })
    this.closeModal()
  }

  closeModal(){
    this.modalController.dismiss()
  }

}
