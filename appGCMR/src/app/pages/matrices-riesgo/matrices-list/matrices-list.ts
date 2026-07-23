import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatrizForm } from '../matriz-form/matriz-form';

export interface RiesgoItem {
  id_riesgo: string;
  categoria: string;
  descripcion: string;
  causaRaiz: string;
  consecuencia: string;
  probabilidad: number; // 1 a 5
  impacto: number;      // 1 a 5
  medidasMitigacion: string;
  responsable: string;
  estado: 'Abierto' | 'Mitigado' | 'Materializado';
}

export interface ContextoMatriz {
  id_origen: string;       // id_proyecto o id_proceso
  nombre: string;          // Nombre del Proyecto o del Proceso
  encargado: string;       // Director o Responsable del proceso
  detalles: string;        // Cliente / Departamento
  lista_riesgos: RiesgoItem[];
}

@Component({
  selector: 'app-matrices-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatrizForm],
  templateUrl: './matrices-list.html',
  styleUrls: ['./matrices-list.css']
})
export class MatricesList {
  activeTab = signal<'proyectos' | 'procesos'>('proyectos');
  searchTerm = signal<string>('');
  
  isFormOpen = signal<boolean>(false);
  selectedRiesgo = signal<RiesgoItem | null>(null);
  selectedContextoId = signal<string>(''); 

  expandedMatrices = signal<Set<string>>(new Set());

  // Matrices de Riesgo de Proyectos
  matricesProyectos = signal<ContextoMatriz[]>([
    {
      id_origen: 'PRY-101',
      nombre: 'Supervisión Carretera CA-5 Norte',
      encargado: 'Ing. Carlos Mendoza',
      detalles: 'Cliente: Secretaría de Infraestructura y Transporte (SIT)',
      lista_riesgos: [
        {
          id_riesgo: 'r-101-1',
          categoria: 'Técnico',
          descripcion: 'Fallas geotécnicas imprevistas en los taludes del kilómetro 45.',
          causaRaiz: 'Saturación extrema por lluvias estacionales',
          consecuencia: 'Paralización de obras civiles y renegociación contractual',
          probabilidad: 1,
          impacto: 2,
          medidasMitigacion: 'Instalación de inclinómetros digitales y monitoreo diario',
          responsable: 'Geólogo de Campo',
          estado: 'Abierto'
        },
         {
          id_riesgo: 'r-101-1',
          categoria: 'Técnico',
          descripcion: 'Fallas geotécnicas imprevistas en los taludes del kilómetro 45.',
          causaRaiz: 'Saturación extrema por lluvias estacionales',
          consecuencia: 'Paralización de obras civiles y renegociación contractual',
          probabilidad: 2,
          impacto: 2,
          medidasMitigacion: 'Instalación de inclinómetros digitales y monitoreo diario',
          responsable: 'Geólogo de Campo',
          estado: 'Abierto'
        },
        {
          id_riesgo: 'r-101-2',
          categoria: 'Técnico',
          descripcion: 'Fallas geotécnicas imprevistas en los taludes del kilómetro 45.',
          causaRaiz: 'Saturación extrema por lluvias estacionales',
          consecuencia: 'Paralización de obras civiles y renegociación contractual',
          probabilidad: 3,
          impacto: 3,
          medidasMitigacion: 'Instalación de inclinómetros digitales y monitoreo diario',
          responsable: 'Geólogo de Campo',
          estado: 'Abierto'
        },
        {
          id_riesgo: 'r-101-3',
          categoria: 'Técnico',
          descripcion: 'Fallas geotécnicas imprevistas en los taludes del kilómetro 45.',
          causaRaiz: 'Saturación extrema por lluvias estacionales',
          consecuencia: 'Paralización de obras civiles y renegociación contractual',
          probabilidad: 4,
          impacto: 3,
          medidasMitigacion: 'Instalación de inclinómetros digitales y monitoreo diario',
          responsable: 'Geólogo de Campo',
          estado: 'Abierto'
        },
        {
          id_riesgo: 'r-101-4',
          categoria: 'Técnico',
          descripcion: 'Fallas geotécnicas imprevistas en los taludes del kilómetro 45.',
          causaRaiz: 'Saturación extrema por lluvias estacionales',
          consecuencia: 'Paralización de obras civiles y renegociación contractual',
          probabilidad: 4,
          impacto: 4,
          medidasMitigacion: 'Instalación de inclinómetros digitales y monitoreo diario',
          responsable: 'Geólogo de Campo',
          estado: 'Abierto'
        },
        {
          id_riesgo: 'r-101-5',
          categoria: 'Técnico',
          descripcion: 'Fallas geotécnicas imprevistas en los taludes del kilómetro 45.',
          causaRaiz: 'Saturación extrema por lluvias estacionales',
          consecuencia: 'Paralización de obras civiles y renegociación contractual',
          probabilidad: 4,
          impacto: 5,
          medidasMitigacion: 'Instalación de inclinómetros digitales y monitoreo diario',
          responsable: 'Geólogo de Campo',
          estado: 'Abierto'
        },
        {
          id_riesgo: 'r-101-6',
          categoria: 'Técnico',
          descripcion: 'Fallas geotécnicas imprevistas en los taludes del kilómetro 45.',
          causaRaiz: 'Saturación extrema por lluvias estacionales',
          consecuencia: 'Paralización de obras civiles y renegociación contractual',
          probabilidad: 5,
          impacto: 5,
          medidasMitigacion: 'Instalación de inclinómetros digitales y monitoreo diario',
          responsable: 'Geólogo de Campo',
          estado: 'Abierto'
        },
      ]
    },
    {
      id_origen: 'PRY-102',
      nombre: 'Diseño Base Represa San José',
      encargado: 'Ing. María Elena Torres',
      detalles: 'Cliente: Alcaldía Municipal del Distrito Central (AMDC)',
      lista_riesgos: []
    }
  ]);

  // Matrices de Riesgo de Procesos
  matricesProcesos = signal<ContextoMatriz[]>([
    {
      id_origen: 'PROC-01',
      nombre: 'Licitaciones y Contrataciones Públicas',
      encargado: 'Lic. Roberto Alvarado',
      detalles: 'Departamento: Legal y Finanzas',
      lista_riesgos: [
        {
          id_riesgo: 'r-proc-1',
          categoria: 'Legal',
          descripcion: 'Impugnaciones al pliego de condiciones por parte de competidores.',
          causaRaiz: 'Ambigüedad en cláusulas técnicas específicas',
          consecuencia: 'Retraso de 3 a 6 meses en la adjudicación',
          probabilidad: 3,
          impacto: 4,
          medidasMitigacion: 'Revisión por terna legal externa antes de publicación formal',
          responsable: 'Gerente Legal',
          estado: 'Mitigado'
        }
      ]
    }
  ]);

  currentCollection = computed(() => {
    return this.activeTab() === 'proyectos' ? this.matricesProyectos() : this.matricesProcesos();
  });

  filteredMatrices = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.currentCollection();

    return this.currentCollection().map(matriz => {
      if (matriz.nombre.toLowerCase().includes(term) || matriz.encargado.toLowerCase().includes(term)) {
        return matriz;
      }
      const riesgosFiltrados = matriz.lista_riesgos.filter(r => 
        r.descripcion.toLowerCase().includes(term) || 
        r.categoria.toLowerCase().includes(term)
      );
      return { ...matriz, lista_riesgos: riesgosFiltrados };
    }).filter(matriz => matriz.lista_riesgos.length > 0 || matriz.nombre.toLowerCase().includes(term));
  });

  toggleMatrixExpansion(idOrigen: string) {
    this.expandedMatrices.update(set => {
      const newSet = new Set(set);
      if (newSet.has(idOrigen)) {
        newSet.delete(idOrigen);
      } else {
        newSet.add(idOrigen);
      }
      return newSet;
    });
  }

  isMatrixExpanded(idOrigen: string): boolean {
    return this.expandedMatrices().has(idOrigen);
  }

  // Mapeo dinámico de Etiquetas para la Escala 1 a 25
  getLabelForScore(score: number): string {
    if (score >= 20) return 'Crítico';
    if (score >= 15) return 'Muy Alto';
    if (score >= 10) return 'Alto';
    if (score >= 5) return 'Medio';
    if (score >= 3) return 'Bajo';
    return 'Muy Bajo';
  }

  getStyleClassForScore(score: number): string {
    if (score >= 20) return 'criticidad-critico';
    if (score >= 15) return 'criticidad-muy-alto';
    if (score >= 10) return 'criticidad-alto';
    if (score >= 5) return 'criticidad-medio';
    if (score >= 3) return 'criticidad-bajo';
    return 'criticidad-muy-bajo';
  }

  openCreateRiesgo(idOrigen: string) {
    this.selectedContextoId.set(idOrigen);
    this.selectedRiesgo.set(null);
    this.isFormOpen.set(true);
  }

  openEditRiesgo(idOrigen: string, riesgo: RiesgoItem) {
    this.selectedContextoId.set(idOrigen);
    this.selectedRiesgo.set({ ...riesgo });
    this.isFormOpen.set(true);
  }

  deleteRiesgo(idOrigen: string, idRiesgo: string) {
    if (confirm('¿Desea remover este riesgo de la matriz?')) {
      const updateFn = (list: ContextoMatriz[]) => list.map(m => {
        if (m.id_origen === idOrigen) {
          return { ...m, lista_riesgos: m.lista_riesgos.filter(r => r.id_riesgo !== idRiesgo) };
        }
        return m;
      });

      if (this.activeTab() === 'proyectos') {
        this.matricesProyectos.update(updateFn);
      } else {
        this.matricesProcesos.update(updateFn);
      }
    }
  }

  handleFormSubmission(event: { action: 'save' | 'cancel', data?: RiesgoItem }) {
    this.isFormOpen.set(false);
    if (event.action === 'save' && event.data) {
      const riesgoData = event.data;
      const idOrigen = this.selectedContextoId();

      // Abrir automáticamente el acordeón al crear o guardar
      this.expandedMatrices.update(set => new Set(set).add(idOrigen));

      const updateFn = (list: ContextoMatriz[]) => list.map(m => {
        if (m.id_origen === idOrigen) {
          const index = m.lista_riesgos.findIndex(r => r.id_riesgo === riesgoData.id_riesgo);
          const nuevaLista = [...m.lista_riesgos];
          if (index !== -1) {
            nuevaLista[index] = riesgoData;
          } else {
            nuevaLista.push(riesgoData);
          }
          return { ...m, lista_riesgos: nuevaLista };
        }
        return m;
      });

      if (this.activeTab() === 'proyectos') {
        this.matricesProyectos.update(updateFn);
      } else {
        this.matricesProcesos.update(updateFn);
      }
    }
  }
}