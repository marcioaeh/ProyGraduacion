import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RiesgoItem } from '../matrices-list/matrices-list';

@Component({
  selector: 'app-matriz-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matriz-form.html',
  styleUrls: ['./matriz-form.css']
})
export class MatrizForm implements OnInit {
  @Input() riesgo: RiesgoItem | null = null;
  @Output() closeForm = new EventEmitter<{ action: 'save' | 'cancel', data?: RiesgoItem }>();

  categoria = 'Técnico';
  descripcion = '';
  causaRaiz = '';
  consecuencia = '';
  probabilidad = 2;
  impacto = 2;
  medidasMitigacion = '';
  responsable = 'Ingeniero Residente';
  efectividadControl = 50;
  estado: 'Abierto' | 'Mitigado' | 'Materializado' = 'Abierto';

  ngOnInit() {
    if (this.riesgo) {
      this.categoria = this.riesgo.categoria;
      this.descripcion = this.riesgo.descripcion;
      this.causaRaiz = this.riesgo.causaRaiz;
      this.consecuencia = this.riesgo.consecuencia;
      this.probabilidad = this.riesgo.probabilidad;
      this.impacto = this.riesgo.impacto;
      this.medidasMitigacion = this.riesgo.medidasMitigacion;
      this.responsable = this.riesgo.responsable;
      this.efectividadControl = this.riesgo.efectividadControl;
      this.estado = this.riesgo.estado;
    }
  }

  get inherentScore(): number { return this.probabilidad * this.impacto; }
  get residualScore(): number { return Number((this.inherentScore * (1 - this.efectividadControl / 100)).toFixed(2)); }

  getLabelForScore(score: number): string {
    if (score >= 9) return 'Crítico';
    if (score >= 6) return 'Alto';
    if (score >= 3) return 'Medio';
    return 'Bajo';
  }

  submit() {
    if (!this.descripcion.trim() || !this.causaRaiz.trim() || !this.consecuencia.trim()) {
      alert('Por favor complete todos los campos obligatorios (*).');
      return;
    }

    const payload: RiesgoItem = {
      id_riesgo: this.riesgo?.id_riesgo || `r-${Date.now()}`,
      categoria: this.categoria,
      descripcion: this.descripcion,
      causaRaiz: this.causaRaiz,
      consecuencia: this.consecuencia,
      probabilidad: Number(this.probabilidad),
      impacto: Number(this.impacto),
      medidasMitigacion: this.medidasMitigacion,
      responsable: this.responsable,
      efectividadControl: Number(this.efectividadControl),
      estado: this.estado
    };

    this.closeForm.emit({ action: 'save', data: payload });
  }

  dismiss() { this.closeForm.emit({ action: 'cancel' }); }
}