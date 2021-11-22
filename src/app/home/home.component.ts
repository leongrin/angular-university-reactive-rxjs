import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {Observable} from 'rxjs';
import {finalize, map} from 'rxjs/operators';
import {CoursesService} from '../services/courses.service';
import {LoadingService} from '../services/loading.service';

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


  constructor(private courseServ: CoursesService, private loadingServ: LoadingService) {

  }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    /*this.loadingServ.loadingOn();*/  // This is an alternative to using the showLoaderUntilCompleted api
    this.courses$ = this.courseServ.getCourses().pipe(
      map(courses => courses.sort(sortCoursesBySeqNo)),
      /*finalize(() => this.loadingServ.loadingOff())*/
    );

    const loadingCourses$ = this.loadingServ.showLoaderUntilCompleted(this.courses$);

    this.beginnerCourses$ = loadingCourses$.pipe(
      map(courses => courses.filter(course => course.category === 'BEGINNER'))
    );

    this.advancedCourses$ = loadingCourses$.pipe(
      map(courses => courses.filter(course => course.category === 'ADVANCED'))
    );

    /*this.beginnerCourses$ = this.courses$.pipe(
      map(courses => courses.filter(course => course.category === 'BEGINNER'))
    );

    this.advancedCourses$ = this.courses$.pipe(
      map(courses => courses.filter(course => course.category === 'ADVANCED'))
    );*/
  }

}




