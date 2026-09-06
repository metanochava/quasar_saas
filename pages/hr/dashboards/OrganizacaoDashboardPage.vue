<template>
  <q-page class="q-pa-sm">
    <s-card flat bordered>
      <q-card-section>
        <div class="text-h6">
          <q-icon name="corporate_fare" class="q-mr-xs" />
          {{ tdc('Organização') }}
        </div>
      </q-card-section>

      <q-separator />

      <div v-if="loading" class="flex flex-center q-pa-xl">
        <q-spinner size="40px" color="primary" />
      </div>

      <template v-else>
        <q-card-section class="row q-col-gutter-md">
          <div class="col-6 col-md-4">
            <s-card flat bordered>
              <q-card-section>
                <div class="text-caption text-grey-6">{{ tdc('Headcount') }}</div>
                <div class="text-h5 text-weight-bold">{{ data.headcount_total }}</div>
              </q-card-section>
            </s-card>
          </div>
          <div class="col-6 col-md-4">
            <s-card flat bordered class="border-warning">
              <q-card-section>
                <div class="text-caption text-grey-6">{{ tdc('Contratos a expirar (30 dias)') }}</div>
                <div class="text-h5 text-weight-bold text-warning">{{ data.contracts_expiring_soon }}</div>
              </q-card-section>
            </s-card>
          </div>
        </q-card-section>

        <q-card-section class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 text-weight-medium q-mb-sm">
              {{ tdc('Headcount por Departamento') }}
            </div>
            <div v-if="!data.headcount_by_department.length" class="text-caption text-grey-6">
              {{ tdc('Sem dados') }}
            </div>
            <q-list v-else separator>
              <q-item v-for="item in data.headcount_by_department" :key="item.position__department__name">
                <q-item-section>{{ item.position__department__name || tdc('Sem departamento') }}</q-item-section>
                <q-item-section side><q-badge color="primary">{{ item.total }}</q-badge></q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 text-weight-medium q-mb-sm">
              {{ tdc('Distribuição por Especialidade') }}
            </div>
            <div v-if="!data.by_specialty.length" class="text-caption text-grey-6">
              {{ tdc('Sem dados') }}
            </div>
            <q-list v-else separator>
              <q-item v-for="item in data.by_specialty" :key="item.specialty__title">
                <q-item-section>{{ item.specialty__title || '—' }}</q-item-section>
                <q-item-section side><q-badge color="secondary">{{ item.total }}</q-badge></q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </template>
    </s-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { tdc } from '../../../services/translation'
import { HTTPAuth, url } from '../../../services/api'

const loading = ref(true)
const data = ref({
  headcount_total: 0,
  headcount_by_department: [],
  contracts_expiring_soon: 0,
  by_specialty: [],
})

onMounted(async () => {
  loading.value = true
  try {
    const { data: response } = await HTTPAuth.get(url({
      type: 'u',
      url: 'hr/dashboard_organizacao',
    }))
    data.value = response
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.border-warning {
  border-color: var(--q-warning) !important;
}
</style>
