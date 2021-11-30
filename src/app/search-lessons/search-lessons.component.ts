import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {CoursesService} from '../services/courses.service';
import {LoadingService} from '../services/loading.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'course',
  templateUrl: './search-lessons.component.html',
  styleUrls: ['./search-lessons.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush  // optional
})
export class SearchLessonsComponent implements OnInit {

  searchResults$: Observable<Lesson[]>;
  loadingLessons$: Observable<Lesson[]>;

  activeLesson: Lesson;

  constructor(private coursesServ: CoursesService,
              private loadingServ: LoadingService) {


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











