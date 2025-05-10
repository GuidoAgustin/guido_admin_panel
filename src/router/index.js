import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  // 1) Home pública: Accesible en "/" y "/home"
  {
    path: '/', // La ruta principal
    name: 'home', // Un nombre descriptivo para la ruta
    component: () => import('@/views/PrincipalPage/Home.vue'),
    alias: '/home' // Permite acceder a este componente también desde /home
  },

  // 2) Rutas públicas de E-Commerce y Ticketing
  {
    path: '/E-Commerce',
    name: 'E-Commerce',
    component: () => import('@/views/E-Commerce/E-Commerce.vue')
  },
  {
    path: '/ticketing',
    name: 'ticketing',
    component: () => import('@/views/Ticketing/Ticketing.vue')
  },

  // 3) Rutas de autenticación (login, forgot/reset password, activación)
  // Estas rutas son públicas y no requieren autenticación inicial
  {
    path: '/', // Mantener bajo root para rutas como /login
    component: () => import('@/views/Auth/AuthLayout.vue'), // Layout para las páginas de autenticación
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/Auth/Login.vue')
      },
      {
        path: 'forgot_password',
        name: 'forgotPassword',
        component: () => import('@/views/Auth/ForgotPassword.vue')
      },
      {
        path: 'reset_password/:token',
        name: 'resetPassword',
        component: () => import('@/views/Auth/ResetPassword.vue')
      },
      {
        path: 'activate_user/:token',
        name: 'activateUser',
        component: () => import('@/views/Auth/ActivateUser.vue')
      }
    ]
  },

  // 4) Rutas protegidas bajo DashboardLayout (requieren autenticación)
  {
    path: '/', // Mantener bajo root, las rutas hijas tendrán paths como /dashboard, /forms, etc.
    component: () => import('@/views/Dashboard/DashboardLayout.vue'), // Layout para las páginas protegidas
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard/Dashboard.vue')
      },
      {
        path: 'forms',
        name: 'forms',
        component: () => import('@/views/UI/Forms.vue')
      },
      {
        path: 'tables',
        name: 'tables',
        component: () => import('@/views/UI/Tables.vue')
      },
      {
        path: 'modals',
        name: 'modals',
        component: () => import('@/views/UI/Modals.vue')
      },
      {
        path: 'tabs',
        name: 'tabs',
        component: () => import('@/views/UI/Tabs.vue')
      },
      {
        path: 'opciones',
        name: 'opciones',
        component: () => import('@/views/Dashboard/Options.vue')
      },
      // E-Commerce y ticketing se movieron a rutas públicas, por lo que se eliminan de aquí
    ]
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});
export default router;
