import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http:HttpClient
  ) { }

  postHttp(url:string,payload:any){
     const headers = new HttpHeaders({
          'Content-Type': 'application/json',
      });
    return this.http.post(url,JSON.stringify(payload),{headers});
  }
}
