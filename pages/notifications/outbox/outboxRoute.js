import { tdc } from '../../../services/translation.js'

// Read-only por desenho (ver notifications/views/outbox.py -
// create/update/partial_update/destroy devolvem sempre 405) - sem
// rotas add_/change_, tal como leave_calendar/recruitment_pipeline
// em hr não têm (mesmo motivo: workflow controlado, não CRUD livre).
export let outboxRoutes = [
  {
    path: '/list_notificationoutbox',
    name: 'list_notificationoutbox',
    component: () => import('./NotificationOutboxLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('notification outbox'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_notificationoutbox',
    },
  },
  {
    path: '/view_notificationoutbox/:id',
    name: 'view_notificationoutbox',
    component: () => import('./NotificationOutboxVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('notification outbox'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_notificationoutbox',
    },
  }
]
