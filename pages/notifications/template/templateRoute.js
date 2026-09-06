import { tdc } from '../../../services/translation.js'

export let templateRoutes = [
  {
    path: '/list_notificationtemplate',
    name: 'list_notificationtemplate',
    component: () => import('./NotificationTemplateLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('notification template'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_notificationtemplate',
    },
  },
  {
    path: '/add_notificationtemplate',
    name: 'add_notificationtemplate',
    component: () => import('./NotificationTemplateSEPage.vue'),
    meta: {
      title: tdc('Add') + ' ' + tdc('notification template'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_notificationtemplate',
    },
  },
  {
    path: '/change_notificationtemplate/:id',
    name: 'change_notificationtemplate',
    component: () => import('./NotificationTemplateSEPage.vue'),
    meta: {
      title: tdc('Edit') + ' ' + tdc('notification template'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_notificationtemplate',
    },
  },
  {
    path: '/view_notificationtemplate/:id',
    name: 'view_notificationtemplate',
    component: () => import('./NotificationTemplateVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('notification template'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_notificationtemplate',
    },
  }
]
