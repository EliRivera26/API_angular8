import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, Inject, OnChanges } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { faUser, faUserEdit, faTrashAlt, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  formUsuario: FormGroup;
  _usuarios = [];
  _usuario = {};
  searchText = '';
  modal:NgbModalRef;
  enviado = false;
  usuarios=[];
  formValues: any;
  reset = false;
  baseUrl="http://localhost:5000/api/";
  faUser = faUser;
  faUserEdit = faUserEdit;
  faTrashAlt = faTrashAlt;
  closeResult: string;
  modalOptions:NgbModalOptions;

  constructor(private modalService: NgbModal, private fb: FormBuilder, private http: HttpClient, private ref: ChangeDetectorRef, private router: Router) 
  { 
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
  }

  this.formUsuario = this.fb.group({
    nombre: new FormControl('', [Validators.required]),
    apellido: new FormControl('', [Validators.required]),
    tel: new FormControl('', [Validators.required, Validators.minLength(10)]),
    edad: new FormControl('', [Validators.required, Validators.maxLength(1)]),
  });

  
  this.getUsuarios("Id");
}

get fu() { return this.formUsuario.controls; }

get tel() { return this.formUsuario.get('tel'); }

onReset(modal) {
  this.enviado = false;
  this.formUsuario.reset();
  this._usuario = {};
  modal.close();
}


//----------------Agregar usuario----------------

adduser(mimodal,usuario) {
  
  this.enviado = true;
  if(this.formUsuario.invalid){
    return;
  }      
    var servicio;
      
        if(usuario.id){

          servicio = this.http.put<Usuario>(this.baseUrl + "Values/"+ usuario.id, usuario)
        }else{

          servicio = this.http.post<Usuario>(this.baseUrl + "Values", usuario)
          
        }

servicio.subscribe(x => {
    if(x.succes){
        
        this._usuarios.unshift(JSON.parse(JSON.stringify(x.modelo)));
        this._usuario = {};
        this.filtrar();
        this.ref.detectChanges();
        this.onReset(mimodal);
        
        
      }else{
            alert(x.errors);
      }
    });     
}


//------------------Editar usuario--------------- 

edituser(_usuario, usuario){
        
  this.open(_usuario);
  this._usuario = usuario;  
}


//-----------------Eliminar usuario---------------
deletuser(usuarios,modal,index){
var service;
if(usuarios[index].id){
  service = this.http.delete<Usuario>(this.baseUrl + "Values/"+ usuarios[index].id); 
  service.subscribe(x =>
    {
      var usuario = x;
      this.usuarios.splice(index,1);
      this.ref.detectChanges();
      modal.close(); 
    }); 
}else{
  modal.error = "no se puede eliminar";
}    
}

//---------------Filtrar usuario-----------------
filtrar(){
  this.usuarios = this._usuarios.filter(user => user.nombre.includes(this.searchText));
}


//-------------Aquí se muestran los usuarios------------ 
getUsuarios(order) {
  return this.http.get<Usuario[]>(this.baseUrl + "Values?order="+ order)
  .subscribe(x => 
    { 
      this._usuarios = x;
      this.usuarios=JSON.parse(JSON.stringify(x)); 
      this.ref.detectChanges(); 
      //this.usuariosfiltrados=JSON.parse(JSON.stringify(x))
    });
}

//------------------Abrir moodal-------------
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

  ngOnInit() {
  }

}
