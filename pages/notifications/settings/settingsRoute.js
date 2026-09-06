import { tdc } from '../../../services/translation.js'

export let settingsRoutes = [
  {
    path: '/list_notificationsettings',
    name: 'list_notificationsettings',
    component: () => import('./NotificationSettingsLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('notification settings'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_notificationsettings',
    },
  },
  {
    path: '/add_notificationsettings',
    name: 'add_notificationsettings',
    component: () => import('./NotificationSettingsSEPage.vue'),
    meta: {
      title: tdc('Add') + ' ' + tdc('notification settings'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_notificationsettings',
    },
  },
  {
    path: '/change_notificationsettings/:id',
    name: 'change_notificationsettings',
    component: () => import('./NotificationSettingsSEPage.vue'),
    meta: {
      title: tdc('Edit') + ' ' + tdc('notification settings'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_notificationsettings',
    },
  },
  {
    path: '/view_notificationsettings/:id',
    name: 'view_notificationsettings',
    component: () => import('./NotificationSettingsVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('notification settings'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_notificationsettings',
    },
  }
]
