import { Component } from '@angular/core';
import { CacheService } from './cache-service.service';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public  key: string = '';
  public value: any = '';
  public expiration: number = 0;
  public result: any = null;
  cacheState: any;

  constructor(private cacheService: CacheService) {
    
  }
  setValue() {

    this.cacheService.setKeyValue(this.key, this.value, this.expiration).subscribe(() => {
      this.result = 'Value set successfully';
      }, error => {
        this.result = 'Error while setting value';
      });
  }
  getValue() {
    this.cacheService.getValue(this.key).subscribe(response => {
        this.result = response;
      }, error => {
        this.result = 'Error while getting value';
    });
  }
  clearValue(){
    this.key = "",
    this.value = "",
    this.expiration = 0
    this.result = ""
  }
  deleteValue() {
    this.cacheService.deleteValue(this.key).subscribe(() => {
        this.result = 'Key deleted successfully';
      }, error => {
        this.result = 'Error while deleting key';
    });
  }
  
}
