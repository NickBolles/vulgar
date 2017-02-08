import { Component } from '@angular/core';

@Component({
  selector: 'detail',
  templateUrl: './detail.template.html'
})
export class DetailComponent {
  constructor() {

  }

  ngOnInit() {
    console.log('hello `Detail` component');
  }

}
