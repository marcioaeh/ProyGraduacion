import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectoForm } from '../proyecto-form/proyecto-form';

export interface ProyectoItem {
  fecha_termino: string;
  id_proyecto: string;
  nombre: string;
  id_cliente: string;
  nombre_cliente: string;
  tipo: 'Supervisión' | 'Diseño' | 'Construcción';
  director: string;
  presupuesto: number;
  fecha_inicio: string;
  estado_actual: 'Planificación' | 'Ejecución' | 'Suspendido' | 'Finalizado';
}

@Component({
  selector: 'app-proyectos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProyectoForm],
  templateUrl: './proyectos-list.html',
  styleUrls: ['./proyectos-list.css']
})
export class ProyectosList {
  // Estado de filtros
  searchTerm = signal<string>('');
  selectedStatus = signal<string>('todos');

  // Control de Modales
  isFormOpen = signal<boolean>(false);
  selectedProyecto = signal<ProyectoItem | null>(null);

  // Catálogo de clientes simulado para vincular nombres en el formulario
  clientesDisponibles = signal<{id: string, nombre: string}[]>([
    { id: 'CLI-412', nombre: 'Secretaría de Infraestructura y Transporte (SIT)' },
    { id: 'CLI-809', nombre: 'Banco Atlántida S.A.' },
    { id: 'CLI-102', nombre: 'Alcaldía Municipal (AMDC)' }
  ]);

  // Lista de proyectos iniciales en memoria (Mock Frontend)
  proyectos = signal<ProyectoItem[]>([
    {
      id_proyecto: 'PRY-201',
      nombre: 'Supervisión de Carretera CA-5 Tramo II',
      id_cliente: 'CLI-412',
      nombre_cliente: 'Secretaría de Infraestructura y Transporte (SIT)',
      tipo: 'Supervisión',
      director: 'Ing. Carlos Mendoza',
      presupuesto: 2450000,
      fecha_inicio: '2026-01-15',
      fecha_termino: '2026-12-31',
      estado_actual: 'Ejecución'
    },
    {
      id_proyecto: 'PRY-202',
      nombre: 'Diseño Hidráulico Represa Río Choluteca',
      id_cliente: 'CLI-102',
      nombre_cliente: 'Alcaldía Municipal (AMDC)',
      tipo: 'Diseño',
      director: 'Ing. María Elena Torres',
      presupuesto: 890000,
      fecha_inicio: '2026-04-01',
      fecha_termino: '2026-12-31',
      estado_actual: 'Planificación'
    }
  ]);

  // Filtro computado reactivo
  filteredProyectos = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const statusFilter = this.selectedStatus();

    return this.proyectos().filter(p => {
      const matchSearch = p.nombre.toLowerCase().includes(term) || p.director.toLowerCase().includes(term) || p.id_proyecto.toLowerCase().includes(term);
      const matchStatus = statusFilter === 'todos' || p.estado_actual === statusFilter;
      return matchSearch && matchStatus;
    });
  });

  // --- Operaciones del CRUD de Proyectos ---
  openCreateForm() {
    this.selectedProyecto.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(proyecto: ProyectoItem) {
    this.selectedProyecto.set({ ...proyecto });
    this.isFormOpen.set(true);
  }

  deleteProyecto(id: string) {
    if (confirm('¿Está seguro de que desea eliminar permanentemente este proyecto de la cartera?')) {
      this.proyectos.update(list => list.filter(p => p.id_proyecto !== id));
    }
  }

  handleFormSubmission(event: { action: 'save' | 'cancel', data?: ProyectoItem }) {
    this.isFormOpen.set(false);

    if (event.action === 'save' && event.data) {
      const proyectoData = event.data;
      
      // Mapear automáticamente el nombre del cliente basado en su ID seleccionado
      const clienteMatch = this.clientesDisponibles().find(c => c.id === proyectoData.id_cliente);
      proyectoData.nombre_cliente = clienteMatch ? clienteMatch.nombre : 'Cliente No Especificado';

      this.proyectos.update(list => {
        const index = list.findIndex(p => p.id_proyecto === proyectoData.id_proyecto);
        if (index !== -1) {
          const updatedList = [...list];
          updatedList[index] = proyectoData;
          return updatedList;
        } else {
          return [...list, proyectoData];
        }
      });
    }
  }
}