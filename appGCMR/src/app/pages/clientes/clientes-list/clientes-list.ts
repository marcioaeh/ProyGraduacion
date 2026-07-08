import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './clientes-list.html',
  styleUrl: './clientes-list.css',
})
export class ClientesList {}
