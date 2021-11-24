import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


import {Router} from '@angular/router';
import {AuthStoreService} from '../services/auth-store.service';
import {User} from '../model/user';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authStoreServ: AuthStoreService) {

    this.form = fb.group({
      email: ['test@angular-university.io', [Validators.required]],
      password: ['test', [Validators.required]]
    });

  }

  ngOnInit() {

  }

  login() {
    const val = this.form.value;
    this.authStoreServ.login(val.email, val.password)
      .subscribe((user: User) => {
        console.log(`data => ${Object.keys(user)} and ${Object.values(user)}`);
        if (!user.email) {
          console.log('Not a user. We got an error back.');
        } else {
          this.router.navigateByUrl('/courses');
        }
      }, err => alert('Login failed'));
  }

}
