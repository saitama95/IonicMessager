import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import * as Pusher from 'pusher-js';
(window as any).Pusher = Pusher;

@Injectable({
  providedIn: 'root'
})
export class EchoServiceService {

  constructor() { 
  }

  initizalApp(){
    return new Echo({
      broadcaster: 'pusher', 
      key: '2323233',
      cluster: 'mt1',
      wsHost: 'localhost',
      wsPort: 6001,
      forceTLS: false,
      disableStats: true,
      encrypted: false,  // 
    });
  }
}
