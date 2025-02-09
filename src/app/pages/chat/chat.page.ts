import { Component, OnInit, ViewChild, AfterViewChecked, Inject  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

// service
import { StateService } from 'src/app/services/state.service';
import { StorageService } from 'src/app/services/storage.service';
import { HttpService } from 'src/app/services/http.service';
import { EchoServiceService } from 'src/app/services/echo-service.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone:false,
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent | any;
  allMessages:any[] = [];
  profileImage:string="";
  profileName:string="";
  textMessage:string="";
  receiver_id:number=0;
  sender_id:number=0;
  firstMessage:boolean=false;
  unique_id:string="";
  onlineStatus:boolean=false;
  // pagination
  page=1;
  last_page = 0;

  constructor(
    @Inject('APP_URL') private appUrl: string,
    private router:Router,
    private route:ActivatedRoute,
    private stateMange:StateService,
    private storage:StorageService,
    private http:HttpService,
    private echoService:EchoServiceService,
  ) { }


  ngOnInit() {
    this.route.params.subscribe((res:any)=>{
      this.receiver_id = res.id;
      //this.updateOnlineStatus(true);
      this.allMessages=[];
      this.getUserMessages(res.id);
      setTimeout(() => {
        //this.getReciverOnlineStatus(res.id);
        this.content.scrollToBottom();
      }, 1000);
    });
    this.echoService.initizalApp().channel("chatchannel")
      .listen("ChatEvent",(e:any)=>{
        this.allMessages.push(e.message);
        this.content.scrollToBottom(); 
    });
    this.getUserFromLocal();
  } 

  getReciverOnlineStatus(receiver_id:number){
      this.http.getOnlineStatus(receiver_id).subscribe((res:any)=>{
        this.onlineStatus = res[0].online;
        console.log(this.onlineStatus);
      })
  }

  async updateOnlineStatus(status:boolean){
    let {user_id} = await this.storage.get("login");
    await this.http.updateActiveStatus(user_id,status);
  }



  async getUserMessages(receiver_id:any){
    if(this.page>2){
      if(this.last_page<this.page) return;
    }
    let {user_id} = await this.storage.get("login");
    this.sender_id = user_id;
    let data = {
      sender_id:user_id,
      receiver_id
    }
    this.http.httpHeader(`${this.appUrl}/api/getAllmessage?page=${this.page}`,data)
    .subscribe({
      next:(res:any)=>{
        this.last_page = res.data.last_page;
        if(this.page==1){
          this.allMessages.push(...res.new);
        }else{
          this.allMessages.unshift(...res.new);
        }
      },
    })
  }

  loadMessages(ev:any) {
    this.getUserMessages(this.receiver_id);
    this.page++;
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 1000);
  }

  async getUserFromLocal(){
    let {id,name,image} = await this.storage.get("userprofile");
    this.profileName = name;
    this.profileImage = image;
    this.receiver_id = id;
  }

  getUserFromState(){
    this.stateMange.userprofile$.subscribe((res:any)=>{
      if(!res) return;
      this.profileImage = res.image;
      this.profileName = res.name;
    })
  }

  async sendMessage(){
    let {user_id} = await this.storage.get("login")
    let data = {
      message:this.textMessage,
      unique_id:(this.unique_id)? this.unique_id : new Date().getTime(),
      sender_id:user_id,
      receiver_id:this.receiver_id,
      firstMessage:this.firstMessage
    }
    this.http.httpHeader(`${this.appUrl}/api/sendmessage`,data)
      .subscribe((res:any)=>{
      this.unique_id = res.unique_id;
      this.textMessage =""
    })
  }
  back(){
    this.updateOnlineStatus(false);
    this.router.navigate(["./home"]);
  }
}
