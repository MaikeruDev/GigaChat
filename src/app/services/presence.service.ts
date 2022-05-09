import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/app'
import * as firestore from "firebase/firestore";
import { first, map, switchMap, tap } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { of } from 'rxjs';
import { interval, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  constructor(public http: HttpClient, public afAuth: AngularFireAuth, private db: AngularFirestore, private rdb: AngularFireDatabase) {
    this.afAuth.user.subscribe(async (user: any) => {
      var uid = user.uid
      this.onlineCall(uid);
      var id = setInterval(() => {
        this.onlineCall(uid); 
      }, 25000);
    })
  }

  onlineCall(uid){
    this.http.get('https://michael.prietl.com:23023/online?user=' + uid,{responseType: 'text'}).subscribe((e) => {
      console.log(e)
    })
  }

}
