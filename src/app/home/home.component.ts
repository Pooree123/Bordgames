import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './home.component.html',

  styleUrls: ['./home.component.css']
})
export class HomeComponent {


games = [

{
 icon:'♟️',
 name:'Chess',
 desc:'Classic strategy game'
},

{
 icon:'🃏',
 name:'Card Battle',
 desc:'Fight with cards'
},

{
 icon:'🐉',
 name:'Fantasy',
 desc:'Adventure world'
}

];


rooms = [

{
 name:'Dragon Room',
 players:4
},

{
 name:'War Zone',
 players:6
},

{
 name:'Casual',
 players:2
}

];


}