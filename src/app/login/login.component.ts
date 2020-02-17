import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MyserviceService } from 'src/app/registrouser/myservice.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public formLogin: FormGroup;
  public submitted: Boolean = false;
  public error: {code: number, message: string} = null;
  modalOptions:NgbModalOptions;
  closeResult: string;
  isLogged:boolean;


  constructor(private modalService: NgbModal, private router: Router, private fb: FormBuilder, private http:HttpClient, 
    private myserviceService: MyserviceService) {
  }

  //private basePath = '/api/Login/';
  

  ngOnInit() {
    this.formLogin = this.fb.group({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
      

    });
  }
  get g() { return this.formLogin.controls; }

  public submitLogin(content): void {
    this.submitted = true;
    this.error = null;
    if (this.formLogin.valid) {
      this.myserviceService.login(this.g.username.value, this.g.email.value, this.g.password.value).subscribe(
        data =>{
          //this.onCheckpassword(content);
          if(data.id != null){
            this.myserviceService.setUser(data.user);
            let token = data.token;
            this.myserviceService.setToken(token);
            this.router.navigate(['/registro']);
          }else{
            this.open(content)
          }
        },
        error => {
          this.error = error;
        })
    }
  }

  open(content) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  onLogout(): void {
    this.myserviceService.logout();
  }
}
