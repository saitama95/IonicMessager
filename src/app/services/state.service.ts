import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() { }

  tokenState$ = new BehaviorSubject<any>(null);
  userprofile$ = new BehaviorSubject<any>(null);
  userStatus$ = new BehaviorSubject<any>(null);
}
