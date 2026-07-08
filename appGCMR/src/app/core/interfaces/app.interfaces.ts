import { Timestamp } from '@angular/fire/firestore';

// ==========================================
// 1. CATÁLOGOS PARAMÉTRICOS
// ==========================================
export interface CatRol {
  id_rol: string;          // PK
  nombre_rol: string;      // Dueño, Administrador, Usuario
  nivel_acceso: number;    // 1, 2, 3
}

export interface CatSector {
  id_sector: string;       // PK
  nombre_sector: string;   // Público, Privado, ONG
}

export interface CatTipoProyecto {
  id_tipo: string;         // PK
  nombre_tipo: string;     // Supervisión, Diseño, Construcción
}

export interface CatCategoriaRiesgo {
  id_categoria: string;    // PK
  nombre_categoria: string; // Legal, Social, Climático, Técnico
}

export interface CatEstadoRiesgo {
  id_estado: string;       // PK
  nombre_estado: string;   // Abierto, Mitigado, Materializado
}

// ==========================================
// 2. ENTIDADES PRINCIPALES
// ==========================================
export interface Usuario {
  id_usuario: string;      // PK (Auth UID)
  id_rol: string;          // FK
  nombre_completo: string;
  correo: string;
  puesto: string;
  especialidad: string;
  telefono: string;
  estado_activo: boolean;
}

export interface Funcionario {
  id_funcionario: string;  // PK
  nombre_completo: string;
  cargo: string;
  correo: string;
  telefono: string;
  firma_autorizada: boolean;
}

export interface Cliente {
  id_cliente: string;      // PK
  nombre_institucion: string;
  direccion: string;
  id_sector: string;       // FK
  calificacion_gral: number;
  dias_prom_pago: number;
  funcionarios: Funcionario[]; // Sub-colección o array embebido según el diseño final
}

export interface Proyecto {
  id_proyecto: string;     // PK
  id_cliente: string;      // FK
  nombre_proyecto: string;
  id_tipo: string;         // FK
  puntuacion_riesgo: number;
  fecha_inicio: Timestamp | Date;
  id_usuario: string;      // FK (Director de proyecto asignado)
}

export interface Proceso {
  id_proceso: string;      // PK
  nombre_proceso: string;
  descripcion: string;
  id_usuario: string;      // FK (Responsable del proceso)
}


// 3. MATRICES Y EVALUACIÓN DE RIESGOS

export interface RiesgoItem {
  id_riesgo: string;
  id_categoria: string;      // FK (Clasificación ISO)
  descripcion_riesgo: string;
  causa_raiz: string;
  consecuencia: string;
  
  // Evaluación Inherente
  probabilidad_inherente: number; // 1 a 5
  impacto_inherente: number;      // 1 a 5
  criticidad_inherente: number;   // Probabilidad x Impacto
  rango_inherente: string;        // Bajo, Medio, Alto, Crítico

  // Tratamiento
  medidas_mitigacion: string;
  id_usuario_responsable: string; // FK

  // Evaluación Residual
  probabilidad_residual: number;  // 1 a 5
  impacto_residual: number;       // 1 a 5
  criticidad_residual: number;    // Probabilidad x Impacto
  rango_residual: string;         // Bajo, Medio, Alto, Crítico

  // Seguimiento
  id_estado: string;              // FK (Abierto, Mitigado, etc.)
  fecha_ultima_revision: Timestamp | Date;
}

export interface MatrizRiesgo {
  id_matriz: string;       // PK
  id_proyecto?: string;    // FK (Opcional si es matriz de proyecto)
  id_proceso?: string;     // FK (Opcional si es matriz de proceso)
  tipo_matriz: 'proyecto' | 'proceso';
  
  // Auditoría
  fecha_creacion: Timestamp | Date;
  id_usuario_creador: string; // FK
  estado: 'Pendiente' | 'Aprobado'; // Para el flujo de aprobación del administrador
  
  lista_riesgos: RiesgoItem[];
}