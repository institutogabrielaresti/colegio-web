import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.css']
})
export class ContactoComponent {

  nombre = '';
  email = '';
  telefono = '';
  nivel = '';
  mensaje = '';

  enviando = false;
  enviado = false;

  enviarFormulario() {

    this.enviando = true;

    const templateParams = {
      from_name: this.nombre,
      from_email: this.email,
      telefono: this.telefono,
      nivel: this.nivel,
      message: this.mensaje
    };

    emailjs.send(
      'SERVICE_ID',   // reemplazar
      'TEMPLATE_ID',  // reemplazar
      templateParams,
      'PUBLIC_KEY'    // reemplazar
    )
    .then(() => {

      this.enviando = false;
      this.enviado = true;

      this.nombre = '';
      this.email = '';
      this.telefono = '';
      this.nivel = '';
      this.mensaje = '';

    })
    .catch(error => {

      console.error('Error enviando correo:', error);

      this.enviando = false;

      alert('Hubo un error al enviar el mensaje');

    });

  }

}