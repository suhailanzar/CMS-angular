import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UserServiceService } from 'src/app/services/user-service.service';

export interface article{
  id?:string
  title:string
  content:string
  date:Date
}

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit, OnDestroy{

  articleform!: FormGroup
  private articlesub : Subscription | null = null;

  constructor(private formbuilder:FormBuilder,private service: UserServiceService, private router: Router, private messageservice:MessageService ){}

  ngOnInit(): void {
    this.articleform = this.formbuilder.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    })
  }

  
  onsubmit() {
    if (this.articleform.valid) {

      const signupdata = JSON.stringify(this.articleform.value);
      this.postarticle(this.articleform.value);
    }
  }

  
  postarticle(data:article) {
    this.articlesub = this.service.postArticle(data).subscribe({
      next: (res) => {
        console.log('response from back is', res);

        if (res) {
          this.articleform.reset();
          this.router.navigateByUrl('/articles');
        } else {
          console.error('User data or message missing in response:', res);
        }
      },
      error: (err: any) => {
        if (err && err.error && err.error.message) {
          this.messageservice.add({ severity: 'error', summary: 'Error', detail: err.error.message });
          console.log('error', err.error.message);
        } else {
          console.error('Unexpected error structure:', err);
          alert('An unexpected error occurred.');
        }
      }
    });
  }


  addArticle() {
    Object.keys(this.articleform.controls).forEach(control => {
      this.articleform.get(control)?.markAsTouched();
    });
  }

  ngOnDestroy(): void {
    if (this.articlesub) {
      this.articlesub.unsubscribe();
    }
  }
  

}
