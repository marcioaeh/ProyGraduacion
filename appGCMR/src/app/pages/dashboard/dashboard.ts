import { Component, signal, computed, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AlertaItem {
  id_alerta: string;
  titulo: string;
  mensaje: string;
  tipo: 'critico' | 'advertencia' | 'info';
  fecha: string;
  estado_leida: boolean;
}

export interface RiesgoMapa {
  probabilidad: number; // 1 a 5 (Eje Y)
  impacto: number;      // 1 a 5 (Eje X)
}

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  @Output() navigate = new EventEmitter<string>();

  // Matriz de riesgos actual para mapear en la cuadrícula 5x5
  riesgos = signal<RiesgoMapa[]>([
    { probabilidad: 5, impacto: 5 }, // Crítico
    { probabilidad: 4, impacto: 5 }, // Crítico
    { probabilidad: 4, impacto: 4 }, // Muy Alto
    { probabilidad: 3, impacto: 4 }, // Alto
    { probabilidad: 3, impacto: 3 }, // Medio
    { probabilidad: 2, impacto: 3 }, // Medio
    { probabilidad: 1, impacto: 2 }, // Bajo
    { probabilidad: 1, impacto: 1 }  // Muy Bajo
  ]);

  alertas = signal<AlertaItem[]>([
    {
      id_alerta: 'alt-001',
      titulo: 'Retraso de Pago Detectado',
      mensaje: 'La Secretaría de Infraestructura y Transporte (SIT) supera los 60 días de saldo pendiente.',
      tipo: 'critico',
      fecha: '2026-07-20',
      estado_leida: false
    },
    {
      id_alerta: 'alt-002',
      titulo: 'Riesgo Crítico en Inspección',
      mensaje: 'Fallas geotécnicas en Carretera CA-5 requieren revisión urgente de terna técnica.',
      tipo: 'advertencia',
      fecha: '2026-07-21',
      estado_leida: false
    }
  ]);

  // KPIs
  totalProyectos = signal<number>(8);
  proyectosActivos = signal<number>(5);
 
  totalClientes = signal<number>(4);

  // Rangos para dibujar la grilla 5x5 (Probabilidad Y: 5 down to 1, Impacto X: 1 to 5)
  filasProbabilidad = [5, 4, 3, 2, 1];
  columnasImpacto = [1, 2, 3, 4, 5];

  // Conteo dinámico de riesgos en una celda de la matriz
  getRiskCountInCell(p: number, i: number): number {
    return this.riesgos().filter(r => r.probabilidad === p && r.impacto === i).length;
  }

  // Estilo/Color dinámico para cada celda de la matriz de criticidad
  getCellClass(p: number, i: number): string {
    const score = p * i;
    if (score >= 20) return 'cell-critico';
    if (score >= 15) return 'cell-muy-alto';
    if (score >= 10) return 'cell-alto';
    if (score >= 5)  return 'cell-medio';
    if (score >= 3)  return 'cell-bajo';
    return 'cell-muy-bajo';
  }

  activeAlertsCount = computed(() => this.alertas().filter(a => !a.estado_leida).length);

  marcarLeida(id: string) {
    this.alertas.update(list => list.map(a => a.id_alerta === id ? { ...a, estado_leida: true } : a));
  }

  onNavigate(view: string) {
    this.navigate.emit(view);
  }
}