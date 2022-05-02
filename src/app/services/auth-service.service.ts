import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  uid: any;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private alertController: AlertController) {
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async createUserWithEmailAndPassword(email, password, passwordConfirm, name){
    var size;
    await this.db.collection('users').ref.where("name", "==", name).get().then(async (snap: any) => {
      size = snap.size;
    })
    console.log(size)
    if(size < 1){
      if(password === passwordConfirm && password && passwordConfirm){
        return new Promise<any>((resolve, reject) => {
          this.afAuth.createUserWithEmailAndPassword(email, password).then(credential => {
            credential.user.updateProfile({
              displayName: name,
            })
          }).then(
            async res => {
              await this.afAuth.user.subscribe(user => {

                this.db.collection("users/").doc(user.uid).set({
                  name: name,
                  pfp: "https://avatars.dicebear.com/api/initials/" + name + ".svg",
                  email: email.toLowerCase(),
                  uid: user.uid
                }).then( res => {
                  location.reload();
                })
              })
            },
            async err => {
              const alert = await this.alertController.create({
                header: "Oopsie",
                message: err.message,
                buttons: ["RETRY"]
              })

              await alert.present();
            }
          )
        })
      }
    else{
      this.alert("Error", "Passwords do not match.", "Please try again.", "OK");
    }
    }
    else{
      this.alert("Error", "Username is already taken.", "Please try another Username.", "OK");
    }
  }

  async signInWithEmailAndPassword(email, password){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password)
      .then(
        res => {
          location.reload();
        },
        async err => {
          const alert = await this.alertController.create({
            header: "Oopsie",
            message: err.message,
            buttons: ["RETRY"]
          })

          await alert.present();
        }
      )
    })
  }

  async signOut(){
    return new Promise<void>((resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.afAuth.signOut()
          .then(() => {
            resolve();
            location.reload();
          }).catch((error) => {
            reject();
          });
      }
    })
  }

  async resetPW(email){
    if(email){
    this.afAuth.sendPasswordResetEmail(email)
    .then(async (res: any) =>{
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Geschafft!',
        message: "Eine E-Mail zum Zurücksetzen Ihres Passworts wurde gesendet.",
        buttons: ['OK']
      });
  
      await alert.present();
    })
    .catch(async (err: any) =>{
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: err.message,
        buttons: ['OK']
      });
  
      await alert.present();
      })
    }
    else{
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: 'Bitte geben Sie eine gültige E-Mail ein.',
        buttons: ['OK']
      });
  
      await alert.present();
    }
  }

  userDetails(){
    return this.afAuth.user;
  }

  async alert(header: any, subHeader: any, message: any, buttons: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [buttons]
    });

    await alert.present();
  }

}
