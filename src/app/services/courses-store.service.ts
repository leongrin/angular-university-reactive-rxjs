import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map, shareReplay, tap} from 'rxjs/operators';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {LoadingService} from './loading.service';
import {MessagesService} from './messages.service';
import {HttpClient} from '@angular/common/http';

/*This is a stateful service, that stores the Courses Data*/
@Injectable({
  providedIn: 'root'
})
export class CoursesStoreService implements OnInit {

  private coursesSubject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.coursesSubject.asObservable();

  constructor(private loadingServ: LoadingService,
              private messageServ: MessagesService,
              private http: HttpClient) {
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

    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      shareReplay()
    );
  }

  filterByCategory(courseLevel: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses.filter(course => course.category === courseLevel))
    );
  }

  /*This method is only accessible inside this component / service*/
  private loadCourses() {
    /*this.loadingServ.loadingOn();*/  // This is an alternative to using the showLoaderUntilCompleted api
    console.log(`loadCourses() initialized`);

    const loadCourses$ = this.http.get<Course[]>('/api/courses').pipe(
      map(res => res['payload']),
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
      }),
      shareReplay()
      /*finalize(() => this.loadingServ.loadingOff())*/
    );

    this.loadingServ.showLoaderUntilCompleted(loadCourses$).subscribe();
  }


}
