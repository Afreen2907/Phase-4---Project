import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  @ViewChild('name') userName!: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  startQuiz() {
    localStorage.setItem("name", this.userName.nativeElement.value)
  }

}
