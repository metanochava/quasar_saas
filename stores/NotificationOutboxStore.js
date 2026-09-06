import { createBaseStore } from '../base/base_store'

export const useNotificationOutboxStore = createBaseStore(
  'notificationOutbox',
  {
    app: 'notifications',
    model: 'NotificationOutbox'
  },
  {
    state: () => ({

    }),

    getters: {

    },

    actions: {

    }
  }
)
