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
      this.estado = this.riesgo.estado;
    }
  }

  get inherentScore(): number { return this.probabilidad * this.impacto; }
  

  getLabelForScore(score: number): string {
    if (score >= 20) return 'Crítico';
    if (score >= 15) return 'Muy Alto';
    if (score >= 10) return 'Alto';
    if (score >= 5) return 'Medio';
    if (score >= 3) return 'Bajo';
    return 'Muy Bajo';
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
      
      estado: this.estado
    };

    this.closeForm.emit({ action: 'save', data: payload });
  }

  dismiss() { this.closeForm.emit({ action: 'cancel' }); }
}