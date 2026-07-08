import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'clientes',
    loadComponent: () => import('./pages/clientes/clientes-list/clientes-list').then(m => m.ClientesList)
  },
  {
    path: 'clientes/nuevo',
    loadComponent: () => import('./pages/clientes/cliente-form/cliente-form').then(m => m.ClienteForm)
  },
  {
    path: 'proyectos',
    loadComponent: () => import('./pages/proyectos/proyectos-list/proyectos-list').then(m => m.ProyectosList)
  },
  {
    path: 'proyectos/nuevo',
    loadComponent: () => import('./pages/proyectos/proyecto-form/proyecto-form').then(m => m.ProyectoForm)
  },
  {
    path: 'procesos',
    loadComponent: () => import('./pages/procesos/procesos-list/procesos-list').then(m => m.ProcesosList)
  },
  {
    path: 'procesos/nuevo',
    loadComponent: () => import('./pages/procesos/proceso-form/proceso-form').then(m => m.ProcesoForm)
  },
  {
    path: 'matrices-riesgo',
    loadComponent: () => import('./pages/matrices-riesgo/matrices-list/matrices-list').then(m => m.MatricesList)
  },
  {
    path: 'matrices-riesgo/nueva',
    loadComponent: () => import('./pages/matrices-riesgo/matriz-form/matriz-form').then(m => m.MatrizForm)
  },
  {
    path: 'analisis-ia',
    loadComponent: () => import('./pages/analisis-ia/analisis-ia').then(m => m.AnalisisIa)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];