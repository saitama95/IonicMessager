import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { CheckTokenService } from '../services/check-token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const storage = inject(StorageService);
  const tokenCheck = inject(CheckTokenService);
  const router = inject(Router)
  
    if(route.routeConfig?.path === 'login' || route.routeConfig?.path === 'register') {
      return storage.get("login").then((res:any)=>{
          if(!res) return true;
          let token = res.access_token;
          if((tokenCheck.isValid(token))){
            router.navigate(["/home"]);
            return false;
          }
          return true;
      });
    }
    else if(route.routeConfig?.path === 'home'){
    return storage.get("login").then((res:any)=>{
        if(!res){
          router.navigate(["/login"]);
          return true;
        }
        let token = res.access_token;
        if(!tokenCheck.isValid(token)){
          router.navigate(["/login"]);
          return true;
        }
        return true;
        
    });
  }
  return true;
};
