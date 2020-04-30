import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private API_KEY = 'AIzaSyAa03-kB0PnU1cBtqjDL0SXSZ5EAb9au8A';
  // crear un nuevo usuario
// https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

// login
// https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]


  // token a almacenar en el localStorage

  userToken: string;

  constructor(private http: HttpClient) { 
    this.leerToken();
  }

  login(usuario: UsuarioModel) {
    console.log('login');
    console.log(usuario);

    const authData = {
      ...usuario,
       returnSecureToken: true
    };

    return this.http.post(`${this.URL}signInWithPassword?key=${this.API_KEY}`, 
    authData)
    .pipe(
      map(resp => {
        // console.log('Guardado en el mapa de RXJS');
        this.guardarToken( resp['idToken'] );
        return resp;
      })
    );

  }

  // nuevo usuario
  // https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
  registro( usuario: UsuarioModel) {
    console.log('registro');
    console.log(usuario);

    /*const authData = {
     ...usuario,
      returnSecureToken: true
    }*/

    // otra forma de lo mismo
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };

    console.log(authData);

    return this.http.post(`${this.URL}signUp?key=${this.API_KEY}`, 
    authData)
    .pipe(
      map(resp => {
        // console.log('Guardado en el mapa de rxjs');
        this.guardarToken( resp['idToken'] );
        return resp;
      })
    );
  }

  logout() {
    console.log('logout');
    localStorage.removeItem('token');
  }

  private guardarToken( idToken: string) {

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    const hoy = new Date();
    hoy.setSeconds(3600); // incrementa la hora actual en 1 hr

    localStorage.setItem('expira', hoy.getTime.toString());


  }

  leerToken() {
    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  estaAutenticado(): boolean {

    if (this.userToken === null ||  this.userToken.length < 2 ) {
      return false;
    }

    const expira = Number ( localStorage.getItem('expira'));
    const expiraDate: Date = new Date ( );
    expiraDate.setTime( expira );

    if (expiraDate > new Date() ) {
      return true;
    } else {
      return this.userToken.length > 2;
    }
  }
}
