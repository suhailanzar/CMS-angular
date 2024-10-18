import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/userModel';
import { UserServiceService } from 'src/app/services/user-service.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {


  
user: User = {
  username: '', email: '', password: '',
  };

signupForm!: FormGroup
private signupSubscription: Subscription | null = null;


constructor(private fb: FormBuilder, private service: UserServiceService, private router: Router, private messageservice:MessageService) { }

ngOnInit() {
  this.signupForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.matchValidator('password', 'confirmPassword'),
    updateOn: 'blur'
  });
}



matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const formGroup = control as FormGroup;
    const controlValue = formGroup.controls[controlName].value;
    const matchingControlValue = formGroup.controls[matchingControlName].value;

    if (controlValue !== matchingControlValue) {
      formGroup.controls[matchingControlName].setErrors({ confirmedValidator: 'Passwords do not match.' });
      return { confirmedValidator: 'Passwords do not match.' };
    } else {
      formGroup.controls[matchingControlName].setErrors(null);
      return null;
    }
  };
}

fullvalid() {
  Object.keys(this.signupForm.controls).forEach(control => {
    this.signupForm.get(control)?.markAsTouched();
  });
}

sendSignupData(data: User) {
  this.signupSubscription = this.service.userSignup(data).subscribe({
    next: (res) => {

      console.log('entered the sendsignup data in the angular');
      
      console.log('respons from the backend is ',res);
      

      if (res ) {
        this.signupForm.reset();
        this.messageservice.add({ severity: 'success', summary: 'success', detail: "signup successful" });
          this.router.navigateByUrl('/login');
      }
    },
    error: (err: any) => {
      if (err && err.error.message) {
        this.messageservice.add({ severity: 'error', summary: 'Error', detail: err.error.message });
        console.log('error',err.error.message);
        
      }
    },
  });
}



onSubmit() {
  console.log('form submitted');

  if (this.signupForm.valid) {

    const signupdata = JSON.stringify(this.signupForm.value);
    localStorage.setItem('userMail', signupdata);
    this.sendSignupData(this.signupForm.value);
  }

}

ngOnDestroy() {
  console.log('signuppage destroyued');

  if (this.signupSubscription) {
    this.signupSubscription.unsubscribe();
  }
}


}



