import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss']
})
export class AccountPage implements OnInit {

  properties: firebase.UserInfo;

  constructor(
    private title: Title,
    private router: Router,
    private db: AngularFireDatabase,
    private auth: AuthenticationService
  ) {
    this.title.setTitle('account');
  }

  ngOnInit() {
    this.auth.observe((user: firebase.User) => {
      this.db
        .list<firebase.UserInfo>('/users/' + user.uid + '/account')
        .snapshotChanges().pipe(map((mutation: any[]) => mutation.map(p => {
          return p.payload.val() as firebase.UserInfo;
        })))
        .subscribe((info: firebase.UserInfo[]) => {
          this.properties = info[0];
      });
    });
  }

  propertyKeys() {
    return Object.keys(this.properties);
  }

  logout() {
    this.auth.logoutUser()
    .then(res => {
      console.log(res);
      this.router.navigate(['/']);
    })
    .catch(error => {
      console.log(error);
    });
  }

}
