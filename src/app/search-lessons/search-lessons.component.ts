import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Course} from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import {CoursesService} from '../services/courses.service';
import {LoadingService} from '../services/loading.service';


@Component({
  selector: 'course',
  templateUrl: './search-lessons.component.html',
  styleUrls: ['./search-lessons.component.css']
})
export class SearchLessonsComponent implements OnInit {

  searchResults$: Observable<Lesson[]>;
  loadingLessons$: Observable<Lesson[]>;

  activeLesson: Lesson;

  constructor(private coursesServ: CoursesService,
              private loadingServ: LoadingService,
              private router: Router) {


  }

  ngOnInit() {


  }

  onSearch(search: string) {
    this.searchResults$ = this.coursesServ.searchLessons(search);
    this.loadingLessons$ = this.loadingServ.showLoaderUntilCompleted(this.searchResults$);
  }

  openLesson(lesson: Lesson) {
    this.activeLesson = lesson;
  }

  onBackToSearch() {
    this.activeLesson = null;
  }

}











