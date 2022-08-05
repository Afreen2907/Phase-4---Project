import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { interval } from 'rxjs';
@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html', 
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  public name: string = "";
  public questionList: any = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  counter = 60;
  correctAnswer: number = 0;
  incorrectAnswer: number = 0;
  nextBtnDisabled: boolean = false;
  prevBtnDisabled: boolean = false;
  progress: string = "0";

  isQuizCompleted: boolean = false;
  interval$: any;

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestions();
    if (this.currentQuestion === 0 )  {
      this.prevBtnDisabled = true;
    }
    if (this.currentQuestion === 9 )  {
      this.nextBtnDisabled = true;
    }
    this.startCounter();
  }

  getAllQuestions() {
    this.questionService.getQuestionJson()
      .subscribe(res => {
      this.questionList= res.questions
    })
  }

  nextQuestion() {
    this.currentQuestion++;
    if (this.currentQuestion === 9) {
      this.nextBtnDisabled = true;
    } else {
      this.prevBtnDisabled = false;
      this.nextBtnDisabled = false;
    }
    
    this.getProgressPercent();
  }

  previousQuestion() {
    this.currentQuestion--;
    if (this.currentQuestion === 0) {
      this.prevBtnDisabled = true;
    }
    else {
      this.prevBtnDisabled = false;
      this.nextBtnDisabled = false;
    }
    this.getProgressPercent();
  }

  answer(questionNo: number, option: any) {
    if (option.correct) {
      this.points += 10;
      this.correctAnswer++;
    } else {
      this.incorrectAnswer++;
    }

    setTimeout(() => {
      this.resetCounter();
      this.nextQuestion();
    },1000)
   
    if (questionNo === this.questionList.length) {
      this.stopCounter();
      this.isQuizCompleted = true;
    }
  }

  startCounter() {
    this.interval$ = interval(1000).subscribe(val => {
      this.counter--;
      if (this.counter === 0) {
        this.currentQuestion++;
        this.counter = 60;
      }
    })

    setTimeout(() => {
      this.interval$.unsubscribe()
    }, 600000)
  }

  resetCounter() {
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }

  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }

  resetQuiz() {
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.counter = 60;
    this.currentQuestion = 0;
    this.progress="0"
  }

  getProgressPercent() {
    this.progress = ((this.currentQuestion / this.questionList.length) * 100).toString();
    return this.progress;
  }

  restartQuiz() {
    localStorage.removeItem("name")
    this.resetQuiz()
  }

}
