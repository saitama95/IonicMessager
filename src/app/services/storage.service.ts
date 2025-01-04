import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) {
    this.storage.create();
  }

  public async set(key: string, value: any) {
    return await this.storage?.set(key, value);
  }

  public async get(key:string){
    try {
        return await this.storage?.get(key);
    } catch (error) {
      console.error('Error getting data from storage:', error);
      return null;
    }
  }
}
