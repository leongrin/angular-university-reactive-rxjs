import {AfterViewInit, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Course} from '../model/course';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {CoursesService} from '../services/courses.service';
import {LoadingService} from '../services/loading.service';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MessagesService} from '../services/messages.service';
import {CoursesStoreService} from '../services/courses-store.service';

@Component({
  // tslint:disable-next-line:component-selector
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

    this.coursesStoreServ.saveCourse(this.course.id, changes).pipe(
      catchError(err => {
        const msg = 'An error occurred while saving the course';
        this.messageServ.showErrors(msg);
        console.log(msg, err);
        return throwError(err);
      })
    );

    /*SAVING USING THE LOADING EFFECT WHILE THE OBSERVABLE COMPLETES*/
    /*const save$: Observable<any> = this.coursesStoreServ.saveCourse(this.course.id, changes).pipe(
      catchError(err => {
        const msg = 'An error occurred while saving the course';
        this.messageServ.showErrors(msg);
        console.log(msg, err);
        return throwError(err);
      })
    );
    this.loadingServ.showLoaderUntilCompleted(save$)
      .subscribe();*/

    /*SAVING COURSE IN A OPTIMISTIC WAY, CLOSING THE DIALOG BEFORE A CONFIRMATION FROM THE BACKEND*/
    this.dialogRef.close(changes);

    /*SAVING COURSE IN A NON OPTIMISTIC WAY, CLOSING THE DIALOG AFTER A CONFIRMATION FROM THE BACKEND*/
    /*SOLUTION FOR THE STATELESS WAY*/
    /*this.coursesServ.saveCourse(this.course.id, changes).subscribe(() => {
      this.dialogRef.close(changes);
    });*/
  }

  close() {
    this.dialogRef.close();
  }

}
