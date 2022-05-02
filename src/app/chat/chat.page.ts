import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { updateDoc, serverTimestamp } from "firebase/firestore";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, public db: AngularFirestore) { }

  @ViewChild('content') private content: any;

  chatID: any;
  messages: any = []
  newMsg: any = '';

  currentUser: any = "pw2pzfCKTlJS5dlTAlmG"

  currLength: any = 10

  async ngOnInit() {
    this.paramCheck();
    this.loadMessages().then(()=>{
      this.content.scrollToBottom(200)
    })
  }

  async loadMessages(){
    this.db.collection('chats').doc(this.chatID).collection('messages').ref.orderBy("timestamp").limitToLast(10).onSnapshot(async (_messages: any) => {
      this.messages = []
      _messages.forEach(_message => {
        this.messages.push(_message.data())
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
        this.messages.push(_message.data())
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

    this.newMsg = '';
    setTimeout(() => {
      this.content.scrollToBottom(200)
    })
  }

  paramCheck(){
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.chatID = JSON.parse(params.special);
      }
      else{
        this.router.navigateByUrl('home')
      }
    });
  }

}
