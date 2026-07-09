import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcesoItem } from '../procesos-list/procesos-list';

@Component({
  selector: 'app-proceso-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proceso-form.html',
  styleUrls: ['./proceso-form.css']
})
export class ProcesoForm implements OnInit {
  @Input() proceso: ProcesoItem | null = null;
  @Output() closeForm = new EventEmitter<{ action: 'save' | 'cancel', data?: ProcesoItem }>();

  id_proceso = '';
  nombre = '';
  departamento: 'Legal' | 'Ingeniería' | 'Finanzas' | 'Recursos Humanos' = 'Legal';
  responsable = '';
  descripcion = '';

  isEditMode = false;

  ngOnInit() {
    if (this.proceso) {
      this.isEditMode = true;
      this.id_proceso = this.proceso.id_proceso;
      this.nombre = this.proceso.nombre;
      this.departamento = this.proceso.departamento;
      this.responsable = this.proceso.responsable;
      this.descripcion = this.proceso.descripcion;
    } else {
      this.isEditMode = false;
    }
  }

  submit() {
    if (!this.id_proceso.trim() || !this.nombre.trim() || !this.responsable.trim() || !this.descripcion.trim()) {
      alert('Por favor complete todos los parámetros obligatorios (*).');
      return;
    }

    const payload: ProcesoItem = {
      id_proceso: this.id_proceso.trim().toUpperCase(),
      nombre: this.nombre.trim(),
      departamento: this.departamento,
      responsable: this.responsable.trim(),
      descripcion: this.descripcion.trim()
    };

    this.closeForm.emit({ action: 'save', data: payload });
  }

  dismiss() {
    this.closeForm.emit({ action: 'cancel' });
  }
}