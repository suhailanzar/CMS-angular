import { Injectable } from '@angular/core';
import { User } from '../models/userModel';
import { Observable, pipe, tap } from 'rxjs';
import { getUsers, userLogin } from '../interfaces/Iuser';
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { article } from '../pages/add-article/add-article.component';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  BASE_URL: string = 'http://localhost:3000/'


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
  ) { }


  userLogin(data: User): Observable<userLogin> {
    return this.http.post<userLogin>(`${this.BASE_URL}authorization/login`, data)
  }

  userSignup(data: User): Observable<String> {
    const res = this.http.post<String>(`${this.BASE_URL}authorization/signUp`, data)
    return res

  }

  postArticle(data:article): Observable<string> {        
    return this.http.post<string>(`${this.BASE_URL}article/postArticle`,data)
  }

  getArticles(userid: string | undefined): Observable<article[]> {    
    return this.http.get<article[]>(`${this.BASE_URL}article/getArticles`);
  }

  viewArticle(articleId: string | undefined): Observable<article> {
    if (!articleId) {
      throw new Error("User ID is required"); 
    }
      return this.http.get<article>(`${this.BASE_URL}article/viewArticle/${articleId}`);
  }
  
  
  editArticle(articleId: string | null, updatedArticle: article): Observable<article> {
    return this.http.put<article>(`${this.BASE_URL}article/editArticle/${articleId}`, updatedArticle);
  }  

  deleteArticle(articleId: string | undefined): Observable<string> {
    return this.http.delete<string>(`${this.BASE_URL}article/deleteArticle/${articleId}`);
  }
  




}
