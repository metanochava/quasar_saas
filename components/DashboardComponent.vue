<template>

  <q-page class="q-pa-md">

    <!-- ===================================================== -->
    <!-- DASHBOARDS -->
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


          <!-- COMPONENT -->

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
    <!-- EMPTY -->
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

import {
  useUserStore
} from "../stores/UserStore"

import {
  tdc
} from "../services/translation"

import {
  getDashboards
} from "../services/dashboardRegistry"


const User = useUserStore()


// ============================================================
// REGISTRY
// ============================================================

const dashboards =
  getDashboards()


// ============================================================
// PERMISSION
// ============================================================

const hasPermission = dashboard => {

  const permissions =
    dashboard.permission

  if (!permissions) {
    return true
  }


  // ----------------------------------------------------------
  // STRING
  // ----------------------------------------------------------

  if (
    typeof permissions === "string"
  ) {

    return User.can(
      permissions
    )

  }


  // ----------------------------------------------------------
  // ARRAY
  // ----------------------------------------------------------

  if (
    Array.isArray(permissions)
  ) {

    if (!permissions.length) {
      return true
    }

    if (
      dashboard.permissionMode === "all"
    ) {

      return permissions.every(
        permission =>
          User.can(permission)
      )

    }

    return permissions.some(
      permission =>
        User.can(permission)
    )

  }


  return true
}


// ============================================================
// COMPONENT
// ============================================================

const normalizeComponent = component => {

  if (!component) {
    return null
  }

  if (
    typeof component === "function"
  ) {

    return markRaw(
      defineAsyncComponent(
        component
      )
    )

  }

  return markRaw(
    component
  )

}


// ============================================================
// VISIBLE
// ============================================================

const visibleDashboards =
  computed(() => {

    return dashboards

      .filter(
        dashboard =>
          dashboard &&
          dashboard.visible !== false
      )

      .filter(
        dashboard =>
          hasPermission(
            dashboard
          )
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