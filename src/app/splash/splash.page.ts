import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('ineffectua');
    this.meta.addTags([
      { name: 'og:image', content: '/assets/share-icon.png' }
    ]);
  }

  ngOnInit() {
  }

}
