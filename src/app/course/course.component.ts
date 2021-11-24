import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {combineLatest, Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {CoursesService} from '../services/courses.service';
import {map, startWith} from 'rxjs/operators';

/*THIS SINGLE DATA OBSERVABLE PATTERN IS AN ALTERNATIVE IMPLEMENTATION, TO AVOID THE USE OF NESTED NG-CONTAINERS WITH *ngIf DIRECTIVES*/
interface CourseData {
  course: Course;
  lessons: Lesson[];
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  courseData$: Observable<CourseData>;

  constructor(private route: ActivatedRoute, private coursesServ: CoursesService) {
  }

  ngOnInit() {
    const courseId = +this.route.snapshot.paramMap.get('courseId');
    console.log(typeof courseId);

    const course$ = this.coursesServ.loadCoursesById(courseId).pipe(
      startWith(null)  // give an initial value to the observable, so it loads courseData on the view as soon as the first observable loads
    );

    const lessons$ = this.coursesServ.loadAllCourseLessons(courseId).pipe(
      startWith([])
    );

    this.courseData$ = combineLatest([course$, lessons$]).pipe(
      map(([courseData, lessonsData]) => {
        return {
          course: courseData,
          lessons: lessonsData
        };
      })
    );

  }


}











