import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteForm } from '../cliente-form/cliente-form';

export interface CalificacionHistorica {
  id_calificacion: string;
  puntuacion: number;
  opinion: string;
  fecha: string;
}

export interface ClienteItem {
  id_cliente: string;
  nombre_institucion: string;
  direccion: string;
  sector: 'Público' | 'Privado' | 'ONG';
  calificacion_gral: number;
  dias_prom_pago: number;
  historial_opiniones: CalificacionHistorica[];
}

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ClienteForm],
  templateUrl: './clientes-list.html',
  styleUrls: ['./clientes-list.css']
})
export class ClientesList {
  // Estado reactivo básico
  searchTerm = signal<string>('');
  selectedSector = signal<string>('todos');
  
  // Modales y control de formularios
  isFormOpen = signal<boolean>(false);
  selectedCliente = signal<ClienteItem | null>(null);
  
  // Estado para el modal del historial detallado de opiniones
  activeRatingsCliente = signal<ClienteItem | null>(null);
  nuevaPuntuacion = 5;
  nuevaOpinion = '';

  // Mock de datos iniciales en memoria para el Frontend
  clientes = signal<ClienteItem[]>([
    {
      id_cliente: 'CLI-412',
      nombre_institucion: 'Secretaría de Infraestructura y Transporte (SIT)',
      direccion: 'Barrio Morazán, frente a la terna legal, Tegucigalpa, Honduras',
      sector: 'Público',
      calificacion_gral: 4,
      dias_prom_pago: 75,
      historial_opiniones: [
        { id_calificacion: 'cal-1', puntuacion: 4, opinion: 'Trámite burocrático extenso, pero la junta directiva brinda buen soporte técnico.', fecha: '2026-03-12' }
      ]
    },
    {
      id_cliente: 'CLI-809',
      nombre_institucion: 'Banco Atlántida S.A.',
      direccion: 'Plaza Central, Boulevard Morazán, Tegucigalpa',
      sector: 'Privado',
      calificacion_gral: 5,
      dias_prom_pago: 20,
      historial_opiniones: [
        { id_calificacion: 'cal-2', puntuacion: 5, opinion: 'Desembolsos de estimaciones en menos de 20 días. Excelente flujo.', fecha: '2026-05-18' }
      ]
    }
  ]);

  // Filtro en cascada usando Signals Computados
  filteredClientes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const sectorFiltro = this.selectedSector();

    return this.clientes().filter(c => {
      const matchSearch = c.nombre_institucion.toLowerCase().includes(term) || c.direccion.toLowerCase().includes(term);
      const matchSector = sectorFiltro === 'todos' || c.sector === sectorFiltro;
      return matchSearch && matchSector;
    });
  });

  // --- Métodos de Acción para el CRUD de Clientes ---
  openCreateForm() {
    this.selectedCliente.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(cliente: ClienteItem) {
    this.selectedCliente.set({ ...cliente });
    this.isFormOpen.set(true);
  }

  deleteCliente(id: string) {
    if (confirm('¿Está seguro de que desea eliminar permanentemente este cliente y su historial asociado?')) {
      this.clientes.update(list => list.filter(c => c.id_cliente !== id));
    }
  }

  handleFormSubmission(event: { action: 'save' | 'cancel', data?: ClienteItem }) {
    this.isFormOpen.set(false);
    
    if (event.action === 'save' && event.data) {
      const clienteData = event.data;
      this.clientes.update(list => {
        const index = list.findIndex(c => c.id_cliente === clienteData.id_cliente);
        if (index !== -1) {
          const updatedList = [...list];
          updatedList[index] = clienteData;
          return updatedList;
        } else {
          return [...list, clienteData];
        }
      });
    }
  }

  // --- Métodos del Sub-módulo de Calificaciones e Historial ---
  openRatingsModal(cliente: ClienteItem) {
    this.activeRatingsCliente.set(cliente);
    this.nuevaPuntuacion = 5;
    this.nuevaOpinion = '';
  }

  closeRatingsModal() {
    this.activeRatingsCliente.set(null);
  }

  addCalificacion() {
    const currentCliente = this.activeRatingsCliente();
    if (!currentCliente || !this.nuevaOpinion.trim()) {
      alert('Por favor ingrese una breve opinión o reseña.');
      return;
    }

    const nuevaCal: CalificacionHistorica = {
      id_calificacion: `cal-${Date.now()}`,
      puntuacion: Number(this.nuevaPuntuacion),
      opinion: this.nuevaOpinion.trim(),
      fecha: new Date().toISOString().split('T')[0]
    };

    // Actualizar el cliente dentro de la lista principal en memoria
    this.clientes.update(list => list.map(c => {
      if (c.id_cliente === currentCliente.id_cliente) {
        const nuevoHistorial = [...c.historial_opiniones, nuevaCal];
        // Calcular de forma matemática el nuevo promedio general de estrellas
        const suma = nuevoHistorial.reduce((acc, current) => acc + current.puntuacion, 0);
        const nuevoPromedio = Math.round((suma / nuevoHistorial.length) * 10) / 10;

        const clienteActualizado = {
          ...c,
          historial_opiniones: nuevoHistorial,
          calificacion_gral: Math.round(nuevoPromedio) // Escala de estrellas enteras
        };
        
        // Mantener actualizado el modal en pantalla
        this.activeRatingsCliente.set(clienteActualizado);
        return clienteActualizado;
      }
      return c;
    }));

    this.nuevaOpinion = '';
  }

  handleDeleteRating(idCalificacion: string) {
    const currentCliente = this.activeRatingsCliente();
    if (!currentCliente) return;

    this.clientes.update(list => list.map(c => {
      if (c.id_cliente === currentCliente.id_cliente) {
        const nuevoHistorial = c.historial_opiniones.filter(o => o.id_calificacion !== idCalificacion);
        const suma = nuevoHistorial.reduce((acc, current) => acc + current.puntuacion, 0);
        const nuevoPromedio = nuevoHistorial.length > 0 ? Math.round((suma / nuevoHistorial.length) * 10) / 10 : 5;

        const clienteActualizado = {
          ...c,
          historial_opiniones: nuevoHistorial,
          calificacion_gral: Math.round(nuevoPromedio)
        };

        this.activeRatingsCliente.set(clienteActualizado);
        return clienteActualizado;
      }
      return c;
    }));
  }
}