import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ViewWillLeave } from '@ionic/angular';
import { updateDoc, serverTimestamp } from "firebase/firestore";
import { BehaviorSubject, SubscriptionLike } from 'rxjs';
import { debounceTime, map, skipWhile, takeUntil, takeWhile, tap } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit,ViewWillLeave {

  subscriptions: SubscriptionLike[] = [];
  constructor(private navCtrl: NavController, private route: ActivatedRoute, private router: Router, public db: AngularFirestore) { }

  @ViewChild('content') private content: any;

  isPageScrolling = false;
  scrolling: BehaviorSubject<boolean> = new BehaviorSubject(false);
  imageBg = 'chat-bg';

  chatID: any;

  user = {id: 1, first_name: "Mathias", last_name: "Johannsen", email: "mathias@johannsen.at", avatar: "https://lh3.googleusercontent.com/a-/AOh14GhzaFkQNod1WOU71bT_VxqFkQ8O1qs_bBHf_2Ut=s83-c-mo"};
  chatName: any;
  messages: any = []
  newMsg: any = '';

  currentUser: any = "pw2pzfCKTlJS5dlTAlmG"

  currLength: any = 10

  users = []

  ionViewWillLeave(){
    
  }

  async ngOnInit() {
    console.log(this.messages, this.users)
    this.paramCheck();
    await this.loadUsers()
    this.subscriptions.push(
      this.scrolling.pipe(
        tap(scroll => {
          if (scroll) {
            this.isPageScrolling = scroll;
          }
        }),
        debounceTime(1000),
      ).subscribe(res => this.isPageScrolling = res)
    );
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async loadUsers(){
    await this.db.collection('chats').doc(this.chatID).ref.get().then(async (chat: any) => {
      chat.data().users.forEach(async user => {
        await this.db.collection('users').doc(user).ref.get().then(async (_user: any) => {
          this.users.push({name: _user.data().name, uid: user})
          if(user != this.currentUser){
            this.chatName = _user.data().name
          }
        })
      })
    }).then(async (res: any)  => {
      await this.delay(400) //sunsch gond names names ned ka waurm 
      this.loadMessages(this.users)
    })
    
  }

  async loadMessages(users){
    this.db.collection('chats').doc(this.chatID).collection('messages').ref.orderBy("timestamp").limitToLast(10).onSnapshot(async (_messages: any) => {
      this.messages = []
      _messages.forEach(async _message => {
        var temp = _message.data()

        users.forEach(user => {
          if(user.uid == temp.user){
            temp.username = user.name
          }
        })
        this.content.scrollToBottom(200)

        this.messages.push(temp)
      });
        setTimeout(() => {
          this.content.scrollToBottom(200)
        })
    })
  }

  async loadExtraMessages(len){
    this.db.collection('chats').doc(this.chatID).collection('messages').ref.orderBy("timestamp").limitToLast(len).get().then(async (_messages: any) => {
      this.messages = []
      _messages.forEach(_message => {
        var temp = _message.data()

        this.users.forEach(user => {
          if(user.uid == temp.user){
            temp.username = user.name
          }
        })

        this.messages.push(temp)
      });
    })
  }

  async loadMore(){
    this.currLength += 10
    this.loadExtraMessages(this.currLength)
  }

  getTimeStamp(){
    return serverTimestamp();
  }

  async sendMessage(){
    this.db.collection('chats').doc(this.chatID).collection('messages').add({
      message: this.newMsg,
      user: this.currentUser,
      timestamp: this.getTimeStamp()
    })

    this.db.collection('chats').doc(this.chatID).update({
      last_message: this.newMsg
    })

    this.newMsg = '';
    setTimeout(() => {
      this.content.scrollToBottom(200)
    })
  }

  paramCheck(){
    this.route.queryParams.subscribe(params => {
      if (params && params.chat) {
        this.chatID = JSON.parse(params.chat);
      }
      else{
        this.router.navigateByUrl('home')
      }
    });
  }

}
