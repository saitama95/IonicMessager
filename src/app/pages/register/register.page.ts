import { Component, Inject, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { FormBuilder, Validators,FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone:false
})
export class RegisterPage implements OnInit {

  regsiterForm:FormGroup;
  
  //DOM variable
  passwordType=true;
  confirmType=true;
  errorMessage:any[]=[];
  loginError="";
  loginloading = false;

  constructor(
    @Inject('APP_URL') private appUrl: string,
    private router:Router,
    private http:HttpService,
    private fb:FormBuilder,
    // private stateManage:StatemanageService,
  ) { 
    this.regsiterForm = this.fb.group({
      name:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]],
      confirmpassword:['',[Validators.required,Validators.minLength(6)]]
    },{
      validators:this.passwordMatchValidator
    })
  }

  ngOnInit() {
    
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmpassword')?.value
      ? null
      : { mismatch: true };
  }

  gotoLogin(){
    this.router.navigate(['./login']);
  }

  register(){
    this.loginError="";
    this.loginloading = true;
    this.http.postHttp(`${this.appUrl}/api/register`,this.regsiterForm.value)
    .subscribe({
      next:(res:any)=>{
        this.loginloading = false;
        this.loginError="Register Successful";
      },
      error:(e:any)=>{
        this.loginloading = false;
        if(e.error.errors.email[0]){
          this.loginError = e.error.errors.email[0];
        }else{
          this.loginError="Invalid details"
        }
      }
    })
  }

  showPassword(){
    this.passwordType=!this.passwordType;
  }

  showConfirmPassword(){
    this.confirmType=!this.confirmType;
  }

  saveToUser(name:string,email:string){
   // this.shared.createUser(name,email);
  } 
}
