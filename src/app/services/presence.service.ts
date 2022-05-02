import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/app'
import * as firestore from "firebase/firestore";
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  constructor(public afAuth: AngularFireAuth, private db: AngularFirestore) {
    /* console.log('presence');
    this.updateOnUser().subscribe();
    this.updateOnDisconnect().subscribe();
    this.updateOnAway(); */
  }

  getPresence(uid: string) {
    this.db.collection('users').doc(uid).ref.get().then(async (user: any) => {
      return user.data().last_seen
    })
  }

  getUser(){
    return this.afAuth.authState.pipe(first()).toPromise()
  }

  async setPresence(status: string) {
    const user = await this.getUser()
    if(user){
      return this.db.collection('users').doc(user.uid).ref.update({
        last_seen: status
      })
    }
  }

  /* updateOnUser(){
    
    var userStatusFirestoreRef = firebase.firestore().doc('/status/' + uid);
    const connection = 
  } */
}
