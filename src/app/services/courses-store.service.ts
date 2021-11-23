import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {CoursesService} from './courses.service';
import {LoadingService} from './loading.service';
import {MessagesService} from './messages.service';

/*This is a stateful service, that stores the Courses Data*/
@Injectable({
  providedIn: 'root'
})
export class CoursesStoreService implements OnInit {

  coursesSubject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.coursesSubject.asObservable();

  constructor(private courseServ: CoursesService,
              private loadingServ: LoadingService,
              private messageServ: MessagesService) {
    console.log('Inside constructor to load courses');
    this.loadCourses();  // It only works if called inside the constructor
  }

  ngOnInit() {
  }

  /*Saving first on store optimistically, giving an instant user experience, and then saving to the backend*/
  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const currentCourses = this.coursesSubject.getValue();
    const index = currentCourses.findIndex(course => course.id === courseId);
    const newModifiedCourse = {
      ...currentCourses[index],
      ...changes
    };
    const newCourses: Course[] = [...currentCourses];
    newCourses[index] = newModifiedCourse;
    this.coursesSubject.next(newCourses);

    return this.courseServ.saveCourse(courseId, changes);
  }

  filterByCategory(courseLevel: string): Observable<Course[]> {
    console.log('filterByCategory getting started');
    console.log(`coursesSubject.getValue() => ${this.coursesSubject.getValue().find(course => course.id = '17')?.description}`);
    return this.coursesSubject.pipe(
      tap(courses => console.log(`Inside tap => ${courses.find(course => course.id = '17')?.description}`)),
      map(courses => courses.filter(course => course.category === courseLevel))
    );
  }

  /*This method is only accessible inside this component / service*/
  private loadCourses() {
    /*this.loadingServ.loadingOn();*/  // This is an alternative to using the showLoaderUntilCompleted api
    console.log(`loadCourses() initialized`);

    const loadCourses$ = this.courseServ.getCourses().pipe(
      map(courses => courses.sort(sortCoursesBySeqNo)),
      catchError(err => {
        const message = 'Could not load courses';
        this.messageServ.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      tap(courses => {
        console.log(`Updating courses$ inside loadCourses()`);
        this.coursesSubject.next(courses);
      })
      /*finalize(() => this.loadingServ.loadingOff())*/
    );

    this.loadingServ.showLoaderUntilCompleted(loadCourses$).subscribe();
  }


}
