import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteItem } from '../clientes-list/clientes-list';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-form.html',
  styleUrls: ['./cliente-form.css']
})
export class ClienteForm implements OnInit {
  @Input() cliente: ClienteItem | null = null;
  @Output() closeForm = new EventEmitter<{ action: 'save' | 'cancel', data?: ClienteItem }>();

  nombre_institucion = '';
  direccion = '';
  sector: 'Público' | 'Privado' | 'ONG' = 'Público';
  dias_prom_pago = 30;

  ngOnInit() {
    if (this.cliente) {
      this.nombre_institucion = this.cliente.nombre_institucion;
      this.direccion = this.cliente.direccion;
      this.sector = this.cliente.sector;
      this.dias_prom_pago = this.cliente.dias_prom_pago;
    }
  }

  submit() {
    if (!this.nombre_institucion.trim() || !this.direccion.trim()) {
      alert('Por favor complete la identificación de la institución.');
      return;
    }

    const payload: ClienteItem = {
      id_cliente: this.cliente?.id_cliente || `CLI-${Math.floor(100 + Math.random() * 900)}`,
      nombre_institucion: this.nombre_institucion,
      direccion: this.direccion,
      sector: this.sector,
      calificacion_gral: this.cliente?.calificacion_gral || 5, // Conserva o inicializa
      dias_prom_pago: Number(this.dias_prom_pago),
      historial_opiniones: this.cliente?.historial_opiniones || []
    };

    this.closeForm.emit({ action: 'save', data: payload });
  }

  dismiss() {
    this.closeForm.emit({ action: 'cancel' });
  }
}