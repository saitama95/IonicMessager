import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class CheckTokenService {

  constructor() { }
  // 
  isValid(token:string){
    // return false;
    const payload =this.payload(token);
    if(payload){
      let url  = payload.iss;
       return (
        (url == "http://127.0.0.1:8000/api/login" || url == "http://127.0.0.1:8000/api/register") && 
       !this.checkExpiryTime(payload)
          );
    }
    return false;
  }

  payload(token:string){  
    const payload = token.split(".")[1];
    return this.decode(payload);
  }

  decode(payload:any){
    return JSON.parse(atob(payload));
  }

  checkExpiryTime(payload:any){
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }
}
