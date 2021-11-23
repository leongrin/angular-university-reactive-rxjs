import {AfterViewInit, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Course} from '../model/course';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {CoursesService} from '../services/courses.service';
import {LoadingService} from '../services/loading.service';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {MessagesService} from '../services/messages.service';
import {CoursesStoreService} from '../services/courses-store.service';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements AfterViewInit {

  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesServ: CoursesService,
    private loadingServ: LoadingService,
    private coursesStoreServ: CoursesStoreService,
    private messageServ: MessagesService) {

    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });

  }

  ngAfterViewInit() {

  }

  save() {
    console.log('Saving changes...');
    const changes = this.form.value;

    /*const save$: Observable<any> = this.coursesStoreServ.saveCourse(this.course.id, changes).pipe(
      catchError(err => {
        const msg = 'An error occurred while saving the course';
        this.messageServ.showErrors(msg);
        console.log(msg, err);
        return throwError(err);
      })
    );*/

    this.coursesStoreServ.saveCourse(this.course.id, changes).subscribe();

    this.dialogRef.close(changes);

    /*save$.subscribe();*/

    /*this.loadingServ.showLoaderUntilCompleted(save$)
      .subscribe(val => this.dialogRef.close(val));*/
  }

  close() {
    this.dialogRef.close();
  }

}
