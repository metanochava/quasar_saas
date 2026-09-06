import { tdc } from '../../../services/translation.js'

// Read-only por desenho (ver notifications/views/delivery_attempt.py -
// create/update/partial_update/destroy devolvem sempre 405) - sem
// rotas add_/change_, tal como leave_calendar/recruitment_pipeline
// em hr não têm (mesmo motivo: workflow controlado, não CRUD livre).
export let delivery_attemptRoutes = [
  {
    path: '/list_notificationdeliveryattempt',
    name: 'list_notificationdeliveryattempt',
    component: () => import('./NotificationDeliveryAttemptLPage.vue'),
    meta: {
      title: tdc('View of') + ' ' + tdc('delivery attempt'),
      requiresAuth: true,
      icon: 'list',
      requiredRole: 'list_notificationdeliveryattempt',
    },
  },
  {
    path: '/view_notificationdeliveryattempt/:id',
    name: 'view_notificationdeliveryattempt',
    component: () => import('./NotificationDeliveryAttemptVPage.vue'),
    meta: {
      title: tdc('View') + ' ' + tdc('delivery attempt'),
      requiresAuth: true,
      icon: 'visibility',
      requiredRole: 'view_notificationdeliveryattempt',
    },
  }
]
