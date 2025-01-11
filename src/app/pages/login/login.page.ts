import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators,FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';
import { StateService } from 'src/app/services/state.service';
import { StorageService } from 'src/app/services/storage.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false
})
export class LoginPage implements OnInit {

  passwordType=false;
  loginError=false;
  loginForm:FormGroup;
  constructor(
    private router:Router,
    private fb: FormBuilder,
    private platform: Platform,
    private http:HttpService,
    private alertController: AlertController,
    private storage:StorageService,
    private stateMange:StateService
  ) { 
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.confirmExit();
    });

    this.loginForm = this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required]
    });
  }

  ngOnInit() {
    
  }

  
 
  login(){
      this.http.postHttp("http://127.0.0.1:8000/api/login",this.loginForm.value)
      .subscribe({
        next:(res:any)=>{
          this.storage.set("login",res);
          this.stateMange.tokenState$.next(res);
          this.router.navigate(["/home"]);
        },
        error:(e)=>{
          this.loginError=true;
        }
      })
  }

  actionAfterLogin(response:any){
    console.log(response);
  }
  gotoRegister(){
    this.router.navigate(['./register']);
  }

  async confirmExit() {
    const alert = await this.alertController.create({
      header: 'Confirm Exit',
      message: 'Do you really want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Exit',
          handler: () => {
            this.exitApp();
          },
        },
      ],
    });

    await alert.present();
  }

  exitApp() {
    (navigator as any).app.exitApp();
  }
}
