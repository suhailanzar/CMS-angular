import { group } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UserServiceService } from 'src/app/services/user-service.service';

export interface Article {
  id?: string;
  title: string;
  content: string;
  date: Date;
}

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css'],
})
export class EditArticleComponent implements OnInit, OnDestroy {
  articleForm!: FormGroup;
  private articleSub: Subscription | null = null;
  articleId!: string | null;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private service: UserServiceService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id');

    // Initialize the form
    this.articleForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
    });

    // Load article data if articleId is present
    if (this.articleId) {
      this.viewArticle(this.articleId);
    }
  }

  // Submit the form
  onSubmit(): void {
    if (this.articleForm.valid) {
      const articleData = this.articleForm.value as Article;
      this.saveArticle(articleData);
    } else {
      this.markFormTouched();
    }
  }

  // Save the article (either create or update)
  saveArticle(data: Article): void {
    this.articleSub = this.service.editArticle(this.articleId,data).subscribe({
      next: (res) => {
        if (res) {
          this.router.navigateByUrl('/articles');
        } else {
          console.error('Error: Invalid response from server', res);
        }
      },
      error: (err) => {
        this.handleError(err);
      },
    });
  }

  // Fetch the article by ID and populate the form
  viewArticle(id: string): void {
    this.service.viewArticle(id).subscribe({
      next: (res) => {
        this.articleForm.patchValue({
          title: res.title,
          content: res.content,
        });
      },
      error: (err) => {
        this.handleError(err);
      },
    });
  }

  // Handle API errors
  handleError(err: any): void {
    const message = err?.error?.message || 'An unexpected error occurred.';
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
    console.error('Error:', message);
  }

  // Mark form controls as touched for validation
  markFormTouched(): void {
    Object.keys(this.articleForm.controls).forEach((control) => {
      this.articleForm.get(control)?.markAsTouched();
    });
  }

  // Clean up subscription on destroy
  ngOnDestroy(): void {
    if (this.articleSub) {
      this.articleSub.unsubscribe();
    }
  }
}

