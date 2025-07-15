import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 1) Home pública: Accesible en "/" y "/home"
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/PrincipalPage/Home.vue'),
    alias: '/home'
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
  {
    path: '/',
    component: () => import('@/views/Auth/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/Auth/Login.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/Auth/Registro.vue')
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

  // 4) Rutas del Admin Panel bajo DashboardLayout
  {
    path: '/',
    component: () => import('@/views/Dashboard/DashboardLayout.vue'),
    children: [
      {
        path: 'adminpanel',
        name: 'admin-dashboard',
        component: () => import('@/views/Ticketing/AdminPanel/DashboardSection.vue')
      },
      {
        path: 'adminpanel/events',
        name: 'admin-events',
        component: () => import('@/views/Ticketing/AdminPanel/EventsSection.vue')
      },
      {
        path: 'adminpanel/sales',
        name: 'admin-sales',
        component: () => import('@/views/Ticketing/AdminPanel/SalesSection.vue')
      },
      {
        path: 'adminpanel/users',
        name: 'admin-users',
        component: () => import('@/views/Ticketing/AdminPanel/UsersSection.vue')
      },
      {
        path: 'adminpanel/reports',
        name: 'admin-reports',
        component: () => import('@/views/Ticketing/AdminPanel/ReportsSection.vue')
      },
      // ...aquí puedes agregar más rutas hijas bajo DashboardLayout...{
  //       path: 'dashboard',
  //       name: 'dashboard',
  //       component: () => import('@/views/Dashboard/Dashboard.vue')
  //     },
  //     {
  //       path: 'forms',
  //       name: 'forms',
  //       component: () => import('@/views/UI/Forms.vue')
  //     },
  //     {
  //       path: 'tables',
  //       name: 'tables',
  //       component: () => import('@/views/UI/Tables.vue')
  //     },
  //     {
  //       path: 'modals',
  //       name: 'modals',
  //       component: () => import('@/views/UI/Modals.vue')
  //     },
  //     {
  //       path: 'tabs',
  //       name: 'tabs',
  //       component: () => import('@/views/UI/Tabs.vue')
  //     },
  //     {
  //       path: 'opciones',
  //       name: 'opciones',
  //       component: () => import('@/views/Dashboard/Options.vue')
  //     },
  //     // E-Commerce y ticketing se movieron a rutas públicas, por lo que se eliminan de aquí
  //   ]
  // },
      ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router