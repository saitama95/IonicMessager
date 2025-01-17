import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import * as Pusher from 'pusher-js';
import { StorageService } from './storage.service';
(window as any).Pusher = Pusher;

@Injectable({
  providedIn: 'root'
})
export class EchoServiceService {

  tokenHeader:string="";
  constructor(
    private storage:StorageService,
  ) { 
    this.getToken();
  }

  initizalApp(){
    return new Echo({
      authEndpoint:`http://127.0.0.1:8000/broadcasting/auth`,
      broadcaster: 'pusher', 
      key: '2323233',
      cluster: 'mt1',
      wsHost: "localhost",
      wsPort: 6001,
      forceTLS: false,
      disableStats: true,
      encrypted: false,  // 
      auth: {
        headers: {
            Authorization: `Bearer ${this.tokenHeader}`, // if using token-based auth
        },
      },
    });
  }

  getToken(){
    this.storage.get("login").then(res=>{
      this.tokenHeader = res.access_token;
    })
  }
}
