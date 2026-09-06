<template>
  <q-page class="q-pa-md">
    <h1>Metano</h1>

    <!-- ===================================================== -->
    <!-- DASHBOARDS DISPONÍVEIS -->
    <!-- ===================================================== -->

    <div
      v-if="visibleDashboards.length"
      class="row q-col-gutter-md"
    >
      <div
        v-for="dashboard in visibleDashboards"
        :key="dashboard.key"
        :class="dashboard.col"
      >
        <q-card
          flat
          bordered
          class="full-height"
        >

          <!-- HEADER -->
          <q-card-section
            v-if="dashboard.label || dashboard.icon"
            class="row items-center q-gutter-sm"
          >
            <q-icon
              v-if="dashboard.icon"
              :name="dashboard.icon"
              size="24px"
            />

            <div
              v-if="dashboard.label"
              class="text-h6"
            >
              {{ tdc(dashboard.label) }}
            </div>

            <q-space />

            <q-btn
              v-if="dashboard.route"
              flat
              round
              dense
              icon="open_in_new"
              :to="dashboard.route"
            />
          </q-card-section>

          <q-separator
            v-if="dashboard.label || dashboard.icon"
          />

          <!-- COMPONENTE DO MÓDULO -->
          <q-card-section>
            <component
              :is="dashboard.component"
              :dashboard="dashboard"
            />
          </q-card-section>

        </q-card>
      </div>
    </div>


    <!-- ===================================================== -->
    <!-- SEM DASHBOARDS -->
    <!-- ===================================================== -->

    <slot
      v-else
      name="empty"
    >
      <div
        class="flex flex-center column"
        style="min-height: 70vh"
      >
        <img
          v-if="User?.Entity?.logo?.url"
          :alt="`${User?.Entity?.nome || ''} logo`"
          :src="User.Entity.logo.url"
          style="
            width: 200px;
            height: 200px;
            object-fit: contain;
          "
        />

        <div
          v-if="User?.Entity?.nome"
          class="text-h5 q-mt-md"
        >
          {{ User.Entity.nome }}
        </div>
      </div>
    </slot>

  </q-page>
</template>


<script setup>

import {
  computed,
  defineAsyncComponent,
  markRaw
} from "vue"

import { useUserStore } from "../stores/UserStore"
import { tdc } from "../services/translation"

import {
  getDashboards
} from "../services/dashboardRegistry"


const User = useUserStore()


// ============================================================
// DASHBOARDS REGISTADOS
// ============================================================

const dashboards = getDashboards()


// ============================================================
// PERMISSÕES
// ============================================================

const hasPermission = (dashboard) => {

  const permissions = dashboard.permission

  // Sem restrição de permissão
  if (!permissions) {
    return true
  }

  // Uma única permissão
  if (typeof permissions === "string") {
    return User.can(permissions)
  }

  // Várias permissões
  if (Array.isArray(permissions)) {

    if (!permissions.length) {
      return true
    }

    // Necessita de todas
    if (dashboard.permissionMode === "all") {
      return permissions.every(
        permission => User.can(permission)
      )
    }

    // Default: basta ter uma
    return permissions.some(
      permission => User.can(permission)
    )
  }

  return true
}


// ============================================================
// NORMALIZAR COMPONENTE
// ============================================================

const normalizeComponent = (component) => {

  if (!component) {
    return null
  }

  /*
   * dashboard.js:
   *
   * component: () => import("./Dashboard.vue")
   */

  if (typeof component === "function") {
    return markRaw(
      defineAsyncComponent(component)
    )
  }

  /*
   * Também permite componente já importado:
   *
   * component: MeuDashboard
   */

  return markRaw(component)
}


// ============================================================
// DASHBOARDS VISÍVEIS
// ============================================================

const visibleDashboards = computed(() => {

  return dashboards

    .filter(
      dashboard =>
        dashboard &&
        dashboard.visible !== false
    )

    .filter(
      dashboard =>
        hasPermission(dashboard)
    )

    .sort(
      (a, b) =>
        (a.order ?? 999) -
        (b.order ?? 999)
    )

    .map(
      (dashboard, index) => ({
        ...dashboard,

        key:
          dashboard.name ||
          `${dashboard.module || "dashboard"}-${index}`,

        col:
          dashboard.col ||
          "col-12 col-md-6",

        component:
          normalizeComponent(
            dashboard.component
          )
      })
    )

})
</script>