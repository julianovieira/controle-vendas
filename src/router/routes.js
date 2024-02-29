const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('src/pages/LoginPage.vue') },
      { path: 'register', name: 'register', component: () => import('src/pages/RegisterPage.vue') },
      { path: 'email-confirmation', name: 'email-confirmation', component: () => import('src/pages/EmailConfirmationPage.vue') },
      { path: 'forgot-password', name: 'forgot-password', component: () => import('src/pages/ForgotPasswordPage.vue') },
      { path: 'reset-password', name: 'reset-password', component: () => import('src/pages/ResetPasswordPage.vue') },
      { path: 'product-public/:id', name: 'product-public', component: () => import('src/pages/product/PublicPage.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'home', name: 'home', component: () => import('pages/IndexPage.vue') },
      { path: 'dashboard', name: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: 'customer', name: 'customer', component: () => import('pages/customer/ListPage.vue') },
      { path: 'form-customer/:id?', name: 'form-customer', component: () => import('pages/customer/FormPage.vue') },
      { path: 'category', name: 'category', component: () => import('src/pages/category/ListPage.vue') },
      { path: 'form-category/:id?', name: 'form-category', component: () => import('src/pages/category/FormPage.vue') },
      { path: 'product', name: 'product', component: () => import('src/pages/product/ListPage.vue') },
      { path: 'form-product/:id?', name: 'form-product', component: () => import('src/pages/product/FormPage.vue') },
      { path: 'form-config', name: 'form-config', component: () => import('src/pages/config/FormPage.vue') },
      { path: 'payment', name: 'payment', component: () => import('src/pages/payment/ListPage.vue') },
      { path: 'form-payment/:id?', name: 'form-payment', component: () => import('src/pages/payment/FormPage.vue') },
      { path: 'form-sale/id?', name: 'form-sale', component: () => import('pages/sale/FormPage.vue') },
      { path: 'sale', name: 'sale', component: () => import('pages/sale/ListPage.vue') }
    ],
    meta: {
      requiredAuth: true
    }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
