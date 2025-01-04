import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { FormBuilder, Validators,FormGroup } from '@angular/forms';
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
  loginError=false;

  constructor(
    private router:Router,
    // private shared:SharedService,
    private fb:FormBuilder,
    // private stateManage:StatemanageService,
  ) { 
    this.regsiterForm = this.fb.group({
      name:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(8)]],
      confirmpassword:['',[Validators.required,Validators.minLength(8)]]
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
    let {email,password,name} =  this.regsiterForm.value;
   
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
