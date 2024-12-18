
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user-service.service';
import { User } from 'src/app/models/userModel';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit, OnDestroy {

  user: User = {
    username: '', email: '', password: '', id: ''
  };
  loginForm!: FormGroup
  private LoginSubscription: Subscription | null = null;

  constructor(private frombuilder: FormBuilder, private service: UserServiceService, private router: Router, private messageservice:MessageService ) { }

  ngOnInit() {
    console.log('login page initialized');

    this.loginForm = this.frombuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }



  fullvalid() {
    Object.keys(this.loginForm.controls).forEach(control => {
      this.loginForm.get(control)?.markAsTouched();
    });
  }
  sendLoginData(data: User) {
    this.LoginSubscription = this.service.userLogin(data).subscribe({
      next: (res) => {
        console.log('response from back is', res);

        if (res) {
          this.loginForm.reset();
          localStorage.setItem('userToken', res.accessToken);
          localStorage.setItem('user', JSON.stringify(res.userdata));
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



  onSubmit() {
    if (this.loginForm.valid) {

      const signupdata = JSON.stringify(this.loginForm.value);
      this.sendLoginData(this.loginForm.value);
    }
  }

  ngOnDestroy() {

    if (this.LoginSubscription) {
      this.LoginSubscription.unsubscribe();
    }
  }

    

}
