import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/userModel';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { DialogModule } from 'primeng/dialog';

export interface article{
  articleId?:string
  title:string
  content:string
  date:Date
}


@Component({
  selector: 'app-articles', 
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})


export class ArticlesComponent {

  private articlesubscription: Subscription | null = null;
  articles: article[] = [];
  user: User | null = null; 
  visiblity:boolean = false;
  currentArticle!:article;

  constructor(private messageservice:MessageService ,private authservice: AuthenticationService, private userservice: UserServiceService, private router: Router, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.user = this.getUserDetails();
    this.getArticles();
  }
  
  getUserDetails(): User | null {
    const user = localStorage.getItem('user');
  
    if (user) {
      return JSON.parse(user) as User;
    }
      return null;
  }
  

  getArticles() {
    
    this.articlesubscription = this.userservice.getArticles(this.user?.id).subscribe({
      next: (res) => {
        this.articles = res
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
    })

  }

  viewArticle(id: string | undefined ): void {
    this.visiblity = true
    this.userservice.viewArticle(id).subscribe({
      next: (res) => {
        this.currentArticle = res
        
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
    })
    
  }

  editArticle(id: string | undefined): void {
    if (id) {
      console.log(`Editing article with id: ${id}`);
      this.router.navigateByUrl(`/edit-article/${id}`);
    } else {
      console.error("Article ID is undefined");
    }
  }
  

  deleteArticle(id: string | undefined): void {
    console.log(`Deleting article with id: ${id}`);
  
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this article?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "pi pi-check",
      rejectIcon: "pi pi-times",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        // Call the service to delete the article
        this.userservice.deleteArticle(id).subscribe({
          next: (response) => {
            console.log('Article deleted successfully', response);
            this.messageservice.add({ severity: 'success', summary: 'Success', detail: 'Article deleted successfully' });
            this.getArticles()
          },
          error: (error) => {
            console.error('Error deleting article', error);
            this.messageservice.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete the article' });
          }
        });
      },
      reject: () => {
        console.log('Deletion cancelled');
      },
      key: 'positionDialog'  // Optional: key to customize dialog positioning if needed
    });
  }
  

  addArticle() {
    this.router.navigate(['/add-article']);
  }

  logout() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.authservice.userlogout()
      },

      key: 'positionDialog'
    });

  }

}
