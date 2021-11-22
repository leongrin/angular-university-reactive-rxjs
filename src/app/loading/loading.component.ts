import {Component, Input, OnInit} from '@angular/core';
import {LoadingService} from '../services/loading.service';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router
} from '@angular/router';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  @Input()
  routing = false;

  @Input()
  detectRoutingOngoing = false;


  constructor(public loadingService: LoadingService,
              private router: Router) {

  }

  ngOnInit() {
    /*THIS CODE WORKS GREAT IN CASE OF RESOLVERS AND LAZY LOADING MODULES, BUT ALSO WORK IN ANY ROUTE CHANGE*/
    this.router.events.subscribe(event => {
      if (
        event instanceof NavigationStart ||
        event instanceof RouteConfigLoadStart  // detects the lazy loading of a module
      ) {
        this.loadingService.loadingOn();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationError ||
        event instanceof NavigationCancel ||
        event instanceof RouteConfigLoadEnd   // detects the end of the lazy loading of a module
      ) {
        this.loadingService.loadingOff();
      }
    });

  }


}
