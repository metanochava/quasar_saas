import { tdc } from '../../../services/translation.js'

export let preferenceRoutes = [
  {
    path: '/list_notificationpreference',
    name: 'list_notificationpreference',
    component: () => import('./NotificationPreferenceLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('notification preference'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_notificationpreference',
    },
  },
  {
    path: '/add_notificationpreference',
    name: 'add_notificationpreference',
    component: () => import('./NotificationPreferenceSEPage.vue'),
    meta: {
      title: tdc('Add') + ' ' + tdc('notification preference'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_notificationpreference',
    },
  },
  {
    path: '/change_notificationpreference/:id',
    name: 'change_notificationpreference',
    component: () => import('./NotificationPreferenceSEPage.vue'),
    meta: {
      title: tdc('Edit') + ' ' + tdc('notification preference'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_notificationpreference',
    },
  },
  {
    path: '/view_notificationpreference/:id',
    name: 'view_notificationpreference',
    component: () => import('./NotificationPreferenceVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('notification preference'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_notificationpreference',
    },
  }
]
