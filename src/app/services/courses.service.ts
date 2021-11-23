import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {Observable} from 'rxjs';
import {filter, map, shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) {
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('/api/courses').pipe(
      map(res => res['payload']),
      shareReplay()  // to almost always be used on http observables
    );
  }

  /*Partial means you can take advantage from autocomplete from Course, without having to inform a complete Course object*/
  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    console.log('saveCourse to the backend if subscribed');
    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      shareReplay()
    );
  }
}
