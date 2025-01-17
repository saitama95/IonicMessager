import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone:false
})
export class ProfilePage implements OnInit {

  imageData:any;
  image:any;
  userDetails:any;
  userid:string="";
  constructor(
    @Inject('APP_URL') private appUrl: string,
    private http:HttpService,
    private route: ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe((res:any)=>{
      this.getUserDetails(res.id);
      this.userid = res.id;
    })
    
  }

  getUserDetails(user_id:number){
    let data = {user_id}
    this.http.httpHeader(`${this.appUrl}/api/profile`,data)
    .subscribe({
      next:(res:any)=>{
        this.userDetails = res.users;
        this.image = this.userDetails.image;
      },
      error:(e:any)=>{
        console.log(e);
      }
    })
  }

  back(){
    this.router.navigate(["./home"]);
  }

  selectFile(event:any){
    let file = this.imageData = (event.target.files[0]);
    if(file){
      const reader = new FileReader();
      reader.onload = (e:any)=>{
        this.image = e.target.result;
      }
      reader.readAsDataURL(file);
    }
    let formdate = new FormData();
    formdate.append("image",file);
    formdate.append("user_id",this.userid);
    this.http.imageUpload(`${this.appUrl}/api/uploadimage`,formdate)
    .subscribe({
      next:(res:any)=>{
        console.log(res);
      }
    })
  }
}
