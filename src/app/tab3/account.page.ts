import { FirebaseDataService } from './../services/firebasedata.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss']
})
export class AccountPage implements OnInit {

  properties =  [];

  constructor(
    private title: Title,
    public db: FirebaseDataService
  ) {
    this.title.setTitle('account');
  }

  ngOnInit() {
    this.db
      .get<Array<any>>()
      .subscribe((info: Array<any>) => {
        this.properties = info.filter((val: any) => { return val.key !== 'uid' && val.key !== 'providerId'; });
    });
  }

}
