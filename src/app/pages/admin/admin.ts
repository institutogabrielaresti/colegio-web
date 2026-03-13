import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
selector:'app-admin',
standalone:true,
imports:[FormsModule,CommonModule],
templateUrl:'./admin.html',
styleUrls:['./admin.css']
})

export class AdminComponent{

titulo=''
descripcion=''
fecha=''

mensaje=''

constructor(private http:HttpClient){}

async publicar(){

const nuevaNoticia={
titulo:this.titulo,
descripcion:this.descripcion,
fecha:this.fecha
}

const repo='institutogabrielaresti/colegio-web'
const path='src/assets/noticias.json'

const token='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'

const headers={
Authorization:`Bearer ${token}`,
Accept:'application/vnd.github+json'
}

try{

const file:any=await this.http.get(
`https://api.github.com/repos/${repo}/contents/${path}`,
{headers}
).toPromise()

const contenido=JSON.parse(atob(file.content))

contenido.noticias.unshift(nuevaNoticia)

const actualizado=btoa(
JSON.stringify(contenido,null,2)
)

await this.http.put(
`https://api.github.com/repos/${repo}/contents/${path}`,
{
message:'Nueva noticia publicada',
content:actualizado,
sha:file.sha
},
{headers}
).toPromise()

this.mensaje='Noticia publicada correctamente'

}catch(e){

this.mensaje='Error al publicar'

}

}

}