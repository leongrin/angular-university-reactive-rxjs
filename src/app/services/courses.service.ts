import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Course} from '../model/course';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {Lesson} from '../model/lesson';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) {
  }

  loadCoursesById(courseId: number): Observable<Course> {
    return this.http.get<Course>(`/api/courses/${courseId}`).pipe(
      shareReplay()
    );
  }

  loadAllCourseLessons(courseId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>('/api/lessons', {
      params: {
        courseId: courseId,
        pageSize: '10000'
      }
    }).pipe(
      map(data => data['payload']),
      shareReplay()
    );

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


  searchLessons(search: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>('/api/lessons', {
      params: {
        filter: search,
        pageSize: '100'
      }
    }).pipe(
      map(data => data['payload']),
      shareReplay()
    );
  }


}
