import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  tokenHeader:string="";
  constructor(
    private http:HttpClient,
    private storage:StorageService,
    private stateMange:StateService
  ) { 
    this.getToken();
    this.stateMange.tokenState$.subscribe((res:any)=>{
      if(res){
        this.tokenHeader=res.access_token;
      }
    })
  }

  getToken(){
    this.storage.get("login").then(res=>{
      this.tokenHeader = res.access_token;
    })
  }
  postHttp(url:string,payload:any){
     const headers = new HttpHeaders({
          'Content-Type': 'application/json',
      });
    return this.http.post(url,JSON.stringify(payload),{headers});
  }


  httpHeader(url:string,payload:any){
    const headers = new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization':`Bearer ${this.tokenHeader}`
     });
   return this.http.post(url,JSON.stringify(payload),{headers});
 }

 imageUpload(url:string,payload:any){
  const headers = new HttpHeaders({
       'Authorization':`Bearer ${this.tokenHeader}`
   });
 return this.http.post(url,payload,{headers});
}
}
