import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcesoForm } from '../proceso-form/proceso-form';

export interface ProcesoItem {
  id_proceso: string;
  nombre: string;
  departamento: 'Legal' | 'Ingeniería' | 'Finanzas' | 'Recursos Humanos';
  responsable: string;
  descripcion: string;
}

@Component({
  selector: 'app-procesos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProcesoForm],
  templateUrl: './procesos-list.html',
  styleUrls: ['./procesos-list.css']
})
export class ProcesosList {
  // Estado de filtros
  searchTerm = signal<string>('');
  selectedDept = signal<string>('todos');

  // Control de Modales
  isFormOpen = signal<boolean>(false);
  selectedProceso = signal<ProcesoItem | null>(null);

  // Lista de procesos iniciales en memoria (Mock Frontend)
  procesos = signal<ProcesoItem[]>([
    {
      id_proceso: 'PROC-001',
      nombre: 'Licitaciones y Contrataciones Públicas',
      departamento: 'Legal',
      responsable: 'Lic. Roberto Alvarado',
      descripcion: 'Gestión, revisión y terna legal para la postulación en pliegos de condiciones del estado.'
    },
    {
      id_proceso: 'PROC-002',
      nombre: 'Control de Calidad de Planos Estructurales',
      departamento: 'Ingeniería',
      responsable: 'Ing. María Elena Torres',
      descripcion: 'Verificación técnica periódica de entregables y diseños hidráulicos antes de la aprobación del cliente.'
    },
    {
      id_proceso: 'PROC-003',
      nombre: 'Auditoría y Conciliación de Estimaciones',
      departamento: 'Finanzas',
      responsable: 'Lic. Xiomara Castro',
      descripcion: 'Seguimiento financiero de las planillas de supervisión enviadas a las entidades de gobierno.'
    }
  ]);

  // Filtro computado reactivo
  filteredProcesos = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const deptFilter = this.selectedDept();

    return this.procesos().filter(p => {
      const matchSearch = p.nombre.toLowerCase().includes(term) || p.responsable.toLowerCase().includes(term) || p.id_proceso.toLowerCase().includes(term);
      const matchDept = deptFilter === 'todos' || p.departamento === deptFilter;
      return matchSearch && matchDept;
    });
  });

  // --- Operaciones del CRUD de Procesos ---
  openCreateForm() {
    this.selectedProceso.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(proceso: ProcesoItem) {
    this.selectedProceso.set({ ...proceso });
    this.isFormOpen.set(true);
  }

  deleteProceso(id: string) {
    if (confirm('¿Está seguro de que desea eliminar permanentemente este proceso de la organización?')) {
      this.procesos.update(list => list.filter(p => p.id_proceso !== id));
    }
  }

  handleFormSubmission(event: { action: 'save' | 'cancel', data?: ProcesoItem }) {
    this.isFormOpen.set(false);

    if (event.action === 'save' && event.data) {
      const procesoData = event.data;

      this.procesos.update(list => {
        const index = list.findIndex(p => p.id_proceso === procesoData.id_proceso);
        if (index !== -1) {
          const updatedList = [...list];
          updatedList[index] = procesoData;
          return updatedList;
        } else {
          return [...list, procesoData];
        }
      });
    }
  }
}