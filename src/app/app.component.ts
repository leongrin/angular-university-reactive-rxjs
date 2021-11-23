import {Component, OnInit} from '@angular/core';
import {LoadingService} from './services/loading.service';
import {AuthStoreService} from './services/auth-store.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements  OnInit {

    constructor(public authStoreServ: AuthStoreService) {

    }

    ngOnInit() {


    }

  logout() {
      this.authStoreServ.logout();
  }

}
