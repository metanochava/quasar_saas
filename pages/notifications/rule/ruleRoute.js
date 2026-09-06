import { tdc } from '../../../services/translation.js'

export let ruleRoutes = [
  {
    path: '/list_notificationrule',
    name: 'list_notificationrule',
    component: () => import('./NotificationRuleLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('notification rule'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_notificationrule',
    },
  },
  {
    path: '/add_notificationrule',
    name: 'add_notificationrule',
    component: () => import('./NotificationRuleSEPage.vue'),
    meta: {
      title: tdc('Add') + ' ' + tdc('notification rule'),
      requiresAuth: true,
      icon: 'add',
      requiredRole: 'add_notificationrule',
    },
  },
  {
    path: '/change_notificationrule/:id',
    name: 'change_notificationrule',
    component: () => import('./NotificationRuleSEPage.vue'),
    meta: {
      title: tdc('Edit') + ' ' + tdc('notification rule'),
      requiresAuth: true,
      icon: 'edit',
      requiredRole: 'change_notificationrule',
    },
  },
  {
    path: '/view_notificationrule/:id',
    name: 'view_notificationrule',
    component: () => import('./NotificationRuleVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('notification rule'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_notificationrule',
    },
  }
]
