import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { StateService } from './state.service';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  tokenHeader:string="";
  constructor(
    private http:HttpClient,
    private storage:StorageService,
    private stateMange:StateService,
    private firebase:Firestore,
  ) { 
    this.getToken();
    this.stateMange.tokenState$.subscribe((res:any)=>{
      if(res){
        this.tokenHeader=res.access_token;
      }
    })
  }

  getToken(){
    this.storage.get("login").then(res=>{
      this.tokenHeader = res.access_token;
    })
  }

  postHttp(url:string,payload:any){
     const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
    return this.http.post(url,JSON.stringify(payload),{headers});
  }

  httpHeader(url:string,payload:any){ 
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${this.tokenHeader}`
     });
  return this.http.post(url,JSON.stringify(payload),{headers});
 }

  imageUpload(url:string,payload:any){
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${this.tokenHeader}`
   });
   return this.http.post(url,payload,{headers});
  }


  async updateActiveStatus(id: number,online:boolean) {
    let userId = id.toString();
    const postRef = doc(this.firebase, 'userlist', userId);
    let newdata = { online }
    await updateDoc(postRef, newdata);
  } 

  async createUser(userObj: any) {
    let id = userObj.id.toString()
    const userRef = doc(this.firebase, 'userlist', id);
    return await setDoc(userRef, {
        ...userObj,
        id,
        online: false
    });
  }


  getOnlineStatus(id:any){
    const q = query(
      collection(this.firebase, "userlist"),where('id', '==', id),
    );
    return new Observable(observer=>{
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let messages = querySnapshot.docs.map(doc => doc.data());
        observer.next(messages);
      })
      return () => unsubscribe();
    }) 
  }
}
