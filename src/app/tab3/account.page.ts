import { map, reduce } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Title, TransferState, makeStateKey } from '@angular/platform-browser';

// make state key in state to store users
const STATE_KEY_USER = makeStateKey('user');

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss']
})
export class AccountPage implements OnInit {

  properties =  [];

  constructor(
    private title: Title,
    private router: Router,
    private db: AngularFireDatabase,
    private auth: AuthenticationService,
    private state: TransferState
  ) {
    this.title.setTitle('account');
  }

  ngOnInit() {
    this.auth.observe((user: firebase.User) => {
      this.db
        .list('/users/' + user.uid + '/account')
        .snapshotChanges().pipe(
          map((mutation: any[]) => mutation.map(p => {
            const key = p.key, value = p.payload.val();
            return { key, value };
          }))
        )
        .subscribe((info: Array<any>) => {
          this.properties = info.filter((val: any) => { return val.key !== 'uid' && val.key !== 'providerId'; });
      });
    });
  }

  logout() {
    this.auth.logoutUser()
    .then(res => {
      console.log(res);
      this.state.remove(STATE_KEY_USER)
      this.router.navigate(['/']);
    })
    .catch(error => {
      console.log(error);
    });
  }

}
