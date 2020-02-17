import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { faUser, faUserEdit, faTrashAlt, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MyserviceService } from 'src/app/registrouser/myservice.service';
import { Content } from '@angular/compiler/src/render3/r3_ast';


@Component({
  selector: 'app-registrouser',
  templateUrl: './registrouser.component.html',
  styleUrls: ['./registrouser.component.css']
})
export class RegistrouserComponent implements OnInit {

  formRegistro: FormGroup;
  submitted = false;
  error: { code: number, message: string } = null;
  loading = false;
  closeResult: string;
  modalOptions:NgbModalOptions;
  


  constructor(private modalService: NgbModal, private router: Router, private fb: FormBuilder, private http: HttpClient, private myserviceService: MyserviceService) {
   }
   public isLogged: boolean=false;

  ngOnInit() {

    this.formRegistro = this.fb.group({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confcont: new FormControl('', [Validators.required])

    });
  }
  get f() { return this.formRegistro.controls; }
 

  onSubmit(content) {
    this.submitted = true;

    if (this.formRegistro.invalid) {
      return;
    }

    this.loading = true;
    this.myserviceService.registro(this.f.username.value, this.f.email.value, this.f.password.value,)
      .subscribe(
        user => {
          if(user.id){
            this.myserviceService.setUser(user);
            let token = user.token;
            this.myserviceService.setToken(token);
            this.router.navigate(['/login']);
          }else{
            this.open(content);
          }   
        },
        error => {
          this.loading = false;
        });
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

}
