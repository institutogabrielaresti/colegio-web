import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.css']
})
export class ContactoComponent {

  nombre = '';
  email = '';
  mensaje = '';

  enviarFormulario() {

    const templateParams = {
      from_name: this.nombre,
      from_email: this.email,
      message: this.mensaje
    };

    emailjs.send(
      'SERVICE_ID',
      'TEMPLATE_ID',
      templateParams,
      'PUBLIC_KEY'
    )
    .then(() => {
      alert('Mensaje enviado correctamente');
      this.nombre = '';
      this.email = '';
      this.mensaje = '';
    })
    .catch(() => {
      alert('Error al enviar el mensaje');
    });
  }
}