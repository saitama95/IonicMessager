import { Component, OnInit } from '@angular/core';
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
    this.http.httpHeader(`http://127.0.0.1:8000/api/profile`,data)
    .subscribe({
      next:(res:any)=>{
        this.userDetails = res.users;
        this.image = this.userDetails.image;
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
    this.http.imageUpload(`http://127.0.0.1:8000/api/uploadimage`,formdate)
    .subscribe({
      next:(res:any)=>{
        console.log(res);
      }
    })
  }
}
