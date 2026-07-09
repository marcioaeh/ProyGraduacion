import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectoItem } from '../proyectos-list/proyectos-list';

@Component({
  selector: 'app-proyecto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proyecto-form.html',
  styleUrls: ['./proyecto-form.css']
})
export class ProyectoForm implements OnInit {
  @Input() proyecto: ProyectoItem | null = null;
  @Input() clientes: {id: string, nombre: string}[] = [];
  @Output() closeForm = new EventEmitter<{ action: 'save' | 'cancel', data?: ProyectoItem }>();

  id_proyecto = '';
  nombre = '';
  id_cliente = '';
  tipo: 'Supervisión' | 'Diseño' | 'Construcción' = 'Supervisión';
  director = '';
  presupuesto: number = 0;
  fecha_inicio = '';
  fecha_termino = '';
  estado_actual: 'Planificación' | 'Ejecución' | 'Suspendido' | 'Finalizado' = 'Planificación';

  isEditMode = false;

  ngOnInit() {
    if (this.proyecto) {
      this.isEditMode = true;
      this.id_proyecto = this.proyecto.id_proyecto;
      this.nombre = this.proyecto.nombre;
      this.id_cliente = this.proyecto.id_cliente;
      this.tipo = this.proyecto.tipo;
      this.director = this.proyecto.director;
      this.presupuesto = this.proyecto.presupuesto;
      this.fecha_inicio = this.proyecto.fecha_inicio;
      this.fecha_termino = this.proyecto.fecha_termino;
      this.estado_actual = this.proyecto.estado_actual;
    } else {
      this.isEditMode = false;
      this.fecha_inicio = new Date().toISOString().split('T')[0];
      if (this.clientes.length > 0) {
        this.id_cliente = this.clientes[0].id;
      }
    }
  }

  submit() {
    if (!this.id_proyecto.trim() || !this.nombre.trim() || !this.director.trim() || !this.id_cliente) {
      alert('Por favor complete todos los parámetros obligatorios (*).');
      return;
    }

    if (this.presupuesto <= 0) {
      alert('El presupuesto estimado de la obra/supervisión debe ser mayor a cero.');
      return;
    }

    const payload: ProyectoItem = {
      id_proyecto: this.id_proyecto.trim().toUpperCase(),
      nombre: this.nombre.trim(),
      id_cliente: this.id_cliente,
      nombre_cliente: '', // Se mapea dinámicamente en el componente principal list
      tipo: this.tipo,
      director: this.director.trim(),
      presupuesto: Number(this.presupuesto),
      fecha_inicio: this.fecha_inicio,
      fecha_termino: this.fecha_termino,
      estado_actual: this.estado_actual
    };

    this.closeForm.emit({ action: 'save', data: payload });
  }

  dismiss() {
    this.closeForm.emit({ action: 'cancel' });
  }
}