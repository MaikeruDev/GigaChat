import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ModalController } from '@ionic/angular';
import { arrayUnion } from 'firebase/firestore';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.page.html',
  styleUrls: ['./new-chat.page.scss'],
})
export class NewChatPage implements OnInit {

  constructor(public alertController: AlertController, public authService: AuthServiceService, public platformService: PlatformService, public modalController: ModalController, public db: AngularFirestore) { }

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
          if(user.id != this.uid){
            this.foundUsers.push(user.data())
          }
        });
      })
    }
  }


  async startChat(user){
    let myChats = []
    let othersChats = []
    this.db.collection("users").doc(this.uid).ref.get().then(async (doc: any) => {
      myChats = doc.data().chats
    }).then(async () => {
      this.db.collection("users").doc(user.uid).ref.get().then(async (doc: any) => {
        othersChats = doc.data().chats
      }).then(async () => {
        if(myChats == undefined || othersChats == undefined){
          var users = [user.uid, this.uid]
          this.db.collection('chats').add({
            last_message: "",
            users: [this.uid, user.uid]
          }).then(async (docRef: any) => {
            users.forEach(_user => {
              this.db.collection('users').doc(_user).update({
                chats: arrayUnion(docRef.id)
              })
            })
          })
          this.closeModal()
        }
        else{
          const found = myChats.some(r=> othersChats.includes(r))
          if(found == false){
            var users = [user.uid, this.uid]
            this.db.collection('chats').add({
              last_message: "",
              users: [this.uid, user.uid]
            }).then(async (docRef: any) => {
              users.forEach(_user => {
                this.db.collection('users').doc(_user).update({
                  chats: arrayUnion(docRef.id)
                })
              })
            })
            this.closeModal()
          }
          else{
            const alert = await this.alertController.create({
              cssClass: 'my-custom-class',
              header: "Error",
              message: "You already have an active chat with " + user.name + ".",
              buttons: ['OK']
            });
        
            await alert.present();
          }
        }
      })
    })
    
    
  }

  closeModal(){
    this.modalController.dismiss()
  }

}
