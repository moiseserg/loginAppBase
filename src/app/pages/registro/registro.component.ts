import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit, OnDestroy {

  usuario: UsuarioModel;
  recordarme = false;

  constructor(
    private auth: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
    // this.usuario.email = 'moiseserg@gmail.com';
    // this.usuario.nombre = 'moises';
    // this.usuario.password = 'contra';

    if ( localStorage.getItem('email') ) {
      this.usuario.email = localStorage.getItem('email');
      this.recordarme = true;
    }
  }


  onSubmit( form: NgForm ) {

    if ( form.invalid ) {
      return ;
    }

    // console.log('enviando datos \n' + this.usuario);
    // console.log(this.usuario);
    // console.log(form);
    // respuesta de Firebase: 
    // {
    //  "idToken": "[ID_TOKEN]",
    //  "email": "[user@example.com]",
    //  "refreshToken": "[REFRESH_TOKEN]",
    //  "expiresIn": "3600",
    //  "localId": "tRcfmLH7..."
    // }


    const r = Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor'
    });
    Swal.showLoading();

    this.auth.registro(this.usuario)
    .subscribe( resp => {
      console.log(resp);
      Swal.close();

      if ( this.recordarme ) {
        localStorage.setItem('email', this.usuario.email);
      }

      Swal.fire({
        icon: 'success',
        title: 'Exito',
        text: 'Usuario creado con éxito'
      });

      this.router.navigateByUrl('/home');

    } , err => {
      // error si no se puede generar el nuevo usuario.
      // alert( err.error.error.message );

      Swal.fire({
        icon: 'error',
        title: 'Error al crear usuario',
        text: err.error.error.message
      });
    });
  }


  ngOnDestroy() {

    if ( !this.recordarme) {
      localStorage.removeItem('email');
    }

  }
}
