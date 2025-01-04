import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { FormBuilder, Validators,FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
// import { SharedService } from 'src/app/service/shared.service';
// import { StatemanageService } from 'src/app/service/statemanage.service';
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

  constructor(
    private router:Router,
    private http:HttpService,
    private fb:FormBuilder,
    // private stateManage:StatemanageService,
  ) { 
    this.regsiterForm = this.fb.group({
      name:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(2)]],
      confirmpassword:['',[Validators.required,Validators.minLength(2)]]
    },{
      validators:this.passwordMatchValidator
    })
  }

  ngOnInit() {
    // this.stateManage.dataLogin.subscribe(res=>{
    //   console.log(res);
    // })
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
    this.http.postHttp("http://127.0.0.1:8000/api/register",this.regsiterForm.value)
    .subscribe({
      next:(res:any)=>{
        this.loginError="Register Successful";
      },
      error:(e:any)=>{
        this.loginError="Invalid details"
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
