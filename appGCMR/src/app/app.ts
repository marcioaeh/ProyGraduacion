import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './shared/components/navbar/navbar';
import { Sidebar } from './shared/components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Sidebar],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  // Signal temporal para pruebas visuales. 
  // Cambialo a 'false' si quieres diseñar y ver la pantalla de Login primero.
  isLoggedIn = signal<boolean>(true); 
}