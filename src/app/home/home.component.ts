import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {Observable, throwError} from 'rxjs';
import {catchError, filter, finalize, map, tap} from 'rxjs/operators';
import {CoursesService} from '../services/courses.service';
import {LoadingService} from '../services/loading.service';
import {MessagesService} from '../services/messages.service';
import {CoursesStoreService} from '../services/courses-store.service';

/*This is a smart component that sends data to a presentation component.*/
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  courses$: Observable<Course[]>;


  constructor(private courseServ: CoursesService,
              private loadingServ: LoadingService,
              private messageServ: MessagesService,
              private coursesStoreServ: CoursesStoreService) {

  }

  ngOnInit() {
    /*this.loadCoursesStateless();*/   // to activate this option, needs to update the view too
    this.loadCoursesStateful();
  }



  loadCoursesStateful() {
    /*This is a solution if you want to take the data from the store (BehaviorSubject) to avoid requesting the backend multiple times
     the same data*/
    this.courses$ = this.coursesStoreServ.courses$.pipe(
      filter(courses => courses && courses.length > 0)
    );

    this.beginnerCourses$ = this.coursesStoreServ.filterByCategory('BEGINNER');

    this.advancedCourses$ = this.coursesStoreServ.filterByCategory('ADVANCED');
  }




  /*loadCoursesStateless() {

    /!*THIS IS THE STATELESS SOLUTION, ALWAYS GETTING THE DATA FROM THE SERVER*!/
    /!*this.loadingServ.loadingOn();*!/  // This is an alternative to using the showLoaderUntilCompleted api

    this.courses$ = this.courseServ.getCourses().pipe(
      map(courses => courses.sort(sortCoursesBySeqNo)),
      catchError(err => {
        const message = 'Could not load courses';
        this.messageServ.showErrors(message);
        console.log(message, err);
        return throwError(err);
      })
      /!*finalize(() => this.loadingServ.loadingOff())*!/
    );

    /!*WITH THE LOADING BEING APPLIED, IN A STATELESS WAY*!/
    const loadingCourses$ = this.loadingServ.showLoaderUntilCompleted(this.courses$);

    this.beginnerCourses$ = loadingCourses$.pipe(
      map(courses => courses.filter(course => course.category === 'BEGINNER')),
      tap(courses => console.log(`Inside tap => ${courses.find(course => course.id = '17')?.description}`))
    );
    this.advancedCourses$ = loadingCourses$.pipe(
      map(courses => courses.filter(course => course.category === 'ADVANCED'))
    );

    /!*WITHOUT THE LOADING BEING APPLIED, IN A STATELESS WAY*!/
    /!*this.beginnerCourses$ = this.courses$.pipe(
      map(courses => courses.filter(course => course.category === 'BEGINNER'))
    );
    this.advancedCourses$ = this.courses$.pipe(
      map(courses => courses.filter(course => course.category === 'ADVANCED'))
    );*!/
  }*/

}




