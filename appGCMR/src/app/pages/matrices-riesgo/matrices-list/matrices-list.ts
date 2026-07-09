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
  probabilidad: number;
  impacto: number;
  medidasMitigacion: string;
  responsable: string;
  efectividadControl: number;
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
  selectedContextoId = signal<string>(''); // ID del Proyecto o Proceso seleccionado para añadir/editar

  // Matrices de Riesgo organizadas ÚNICAMENTE como 1 Matriz por cada Proyecto
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
          probabilidad: 3,
          impacto: 3,
          medidasMitigacion: 'Instalación de inclinómetros digitales y monitoreo diario',
          responsable: 'Geólogo de Campo',
          efectividadControl: 70,
          estado: 'Abierto'
        }
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

  // Matrices de Riesgo organizadas ÚNICAMENTE como 1 Matriz por cada Proceso Interno
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
          probabilidad: 2,
          impacto: 3,
          medidasMitigacion: 'Revisión por terna legal externa antes de publicación formal',
          responsable: 'Gerente Legal',
          efectividadControl: 50,
          estado: 'Mitigado'
        }
      ]
    }
  ]);

  // Selección dinámica de la fuente de datos
  currentCollection = computed(() => {
    return this.activeTab() === 'proyectos' ? this.matricesProyectos() : this.matricesProcesos();
  });

  // Filtrado reactivo en cascada (busca tanto en títulos de matrices como en descripciones de sus riesgos)
  filteredMatrices = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.currentCollection();

    return this.currentCollection().map(matriz => {
      // Si el nombre de la matriz coincide, mantenemos todos sus riesgos
      if (matriz.nombre.toLowerCase().includes(term) || matriz.encargado.toLowerCase().includes(term)) {
        return matriz;
      }
      // Si no, filtramos para ver si algún riesgo interno coincide
      const riesgosFiltrados = matriz.lista_riesgos.filter(r => 
        r.descripcion.toLowerCase().includes(term) || 
        r.categoria.toLowerCase().includes(term)
      );
      return { ...matriz, lista_riesgos: riesgosFiltrados };
    }).filter(matriz => matriz.lista_riesgos.length > 0 || matriz.nombre.toLowerCase().includes(term));
  });

  getLabelForScore(score: number): string {
    if (score >= 9) return 'Crítico';
    if (score >= 6) return 'Alto';
    if (score >= 3) return 'Medio';
    return 'Bajo';
  }

  getStyleClassForScore(score: number): string {
    if (score >= 9) return 'criticidad-critico';
    if (score >= 6) return 'criticidad-alto';
    if (score >= 3) return 'criticidad-medio';
    return 'criticidad-bajo';
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

      const updateFn = (list: ContextoMatriz[]) => list.map(m => {
        if (m.id_origen === idOrigen) {
          const index = m.lista_riesgos.findIndex(r => r.id_riesgo === riesgoData.id_riesgo);
          const nuevaLista = [...m.lista_riesgos];
          if (index !== -1) {
            nuevaLista[index] = riesgoData; // Editar
          } else {
            nuevaLista.push(riesgoData); // Crear nuevo riesgo dentro de esta única matriz
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