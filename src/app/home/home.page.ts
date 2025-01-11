import { Component,inject,Inject,Injectable,OnInit, ViewChild  } from '@angular/core';
import { EchoServiceService } from '../services/echo-service.service';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { StorageService } from '../services/storage.service';
import { from } from 'rxjs';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit  {

  userid:number=0;
  textmessage = "";
  messagEcho:any;
  constructor(
    
    private router:Router,
    private http:HttpService,
    private storage:StorageService,
    private stateMange:StateService
  ) {
   
  }
  messages:string[]=[];
  allUsers:any[] = [];
  ngOnInit():void{
    this.getAllUsers();
   
    //this.test();
  }

  async getAllUsers(){
    let {user_id} = await this.storage.get("login");
    let data = {
      user_id,
    }
    this.userid = user_id;
    this.http.httpHeader(`http://127.0.0.1:8000/api/users`,data)
    .subscribe({
      next:(res:any)=>{
        this.allUsers = this.allUsers.concat(res.users)
      }
    })
  }


  sendMessage(){
    let data = {
      message:this.textmessage
    }
    this.http.postHttp(`http://127.0.0.1:8000/api/sendmessage`,data).subscribe(()=>{
      this.textmessage="";
    })
  }

  async gotoProfile(){
    this.router.navigate(["/profile",{
      id:this.userid
    }]);
  }

  gotoHome(){
    this.router.navigate(['/login']);
  }


  logout(){
    this.http.httpHeader(`http://127.0.0.1:8000/api/logout`,"")
    .subscribe({
      next:(res:any)=>{
        this.storage.set("login","").then(()=>{
          this.gotoHome();
        })
      }
    })
  }


  async gotoChat(item:any){
    this.storage.set("userprofile",item);
    this.stateMange.userprofile$.next(item);
    this.router.navigate(["./chat",{
      id:item.id
    }]);
  }
}
