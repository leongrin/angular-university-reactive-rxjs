import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {MessagesService} from '../services/messages.service';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  showMessages = false;

  errors$: Observable<string[]>;

  /*The messageServ is public to be able to be reachable by the template / view.*/
  constructor(public messageServ: MessagesService) {
    console.log('Created message component');
  }

  ngOnInit() {
    this.errors$ = this.messageServ.errors$.pipe(
      tap(() => this.showMessages = true)
    );

  }


  onClose() {
    this.showMessages = false;

  }

}
