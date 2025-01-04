import { Component,OnInit  } from '@angular/core';
import { EchoServiceService } from '../services/echo-service.service';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit  {

  textmessage = "";
  messagEcho:any;
  constructor(
    private echoService:EchoServiceService,
    private router:Router,
    private http:HttpService
  ) {
   
  }
  messages:string[]=[];
  ngOnInit():void{
    this.echoService.initizalApp().channel("chatchannel").listen("ChatEvent",(e:any)=>{
      this.messages.push(e.message);
    });

  }

  sendMessage(){
    let data = {
      message:this.textmessage
    }
    this.http.postHttp("http://127.0.0.1:8000/api/sendmessage",data).subscribe(()=>{
      this.textmessage="";
    })
  }

  gotoHome(){
    this.router.navigate(['/login']);
  }
  
}
