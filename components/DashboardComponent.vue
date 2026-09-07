<template>

  <q-page class="q-pa-md">

    <!-- ===================================================== -->
    <!-- DASHBOARDS -->
    <!-- ===================================================== -->

    <div
      v-if="visibleDashboards.length > 0"
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

          <!-- ================================================= -->
          <!-- HEADER -->
          <!-- ================================================= -->

          <q-card-section
            class="row items-center q-gutter-sm"
          >

            <q-icon
              v-if="dashboard.icon"
              :name="dashboard.icon"
              size="24px"
            />

            <div
              class="text-h6"
            >
              {{ tdc(dashboard.label || dashboard.name) }}
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


          <q-separator />


          <!-- ================================================= -->
          <!-- COMPONENTE -->
          <!-- ================================================= -->

          <q-card-section>

            <component
              v-if="dashboard.component"
              :is="dashboard.component"
              :dashboard="dashboard"
            />

            <div
              v-else
              class="text-grey"
            >
              Dashboard sem componente.
            </div>

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
          :src="User.Entity.logo.url"
          :alt="`${User?.Entity?.nome || ''} logo`"
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


// ============================================================
// USER
// ============================================================

const User =
  useUserStore()


// ============================================================
// COMPONENT CACHE
// ============================================================

const componentCache =
  new WeakMap()


// ============================================================
// CAN
// ============================================================

const can = permission => {

  if (
    permission === null ||
    permission === undefined ||
    permission === ""
  ) {
    return true
  }


  const value =
    String(permission)
      .trim()
      .toLowerCase()


  if (!value) {
    return true
  }


  return User.Permissions?.has(
    value
  ) === true
}


// ============================================================
// HAS PERMISSION
// ============================================================

const hasPermission = dashboard => {

  const permission =
    dashboard?.permission


  // ==========================================================
  // SEM PERMISSÃO
  // ==========================================================

  if (
    permission === null ||
    permission === undefined ||
    permission === ""
  ) {
    return true
  }


  // ==========================================================
  // STRING
  // ==========================================================

  if (
    typeof permission === "string"
  ) {

    return can(
      permission
    )

  }


  // ==========================================================
  // ARRAY
  // ==========================================================

  if (
    Array.isArray(permission)
  ) {

    if (
      permission.length === 0
    ) {
      return true
    }


    // ========================================================
    // ALL
    // ========================================================

    if (
      dashboard.permissionMode === "all"
    ) {

      return permission.every(
        item =>
          can(item)
      )

    }


    // ========================================================
    // ANY - DEFAULT
    // ========================================================

    return permission.some(
      item =>
        can(item)
    )

  }


  return true
}


// ============================================================
// NORMALIZE COMPONENT
// ============================================================

const normalizeComponent = component => {

  if (!component) {
    return null
  }


  // ==========================================================
  // LAZY COMPONENT
  // ==========================================================

  if (
    typeof component === "function"
  ) {

    if (
      componentCache.has(
        component
      )
    ) {

      return componentCache.get(
        component
      )

    }


    const asyncComponent =
      markRaw(
        defineAsyncComponent(
          component
        )
      )


    componentCache.set(
      component,
      asyncComponent
    )


    return asyncComponent

  }


  // ==========================================================
  // COMPONENTE NORMAL
  // ==========================================================

  return markRaw(
    component
  )

}


// ============================================================
// VISIBLE DASHBOARDS
// ============================================================

const visibleDashboards =
  computed(() => {

    // ========================================================
    // IMPORTANTE
    //
    // Faz o computed depender explicitamente das permissões.
    // ========================================================

    const permissions =
      User.Permissions


    const dashboards =
      getDashboards()


    console.log(
      "[RESAAS] REGISTRY:",
      dashboards
    )


    console.log(
      "[RESAAS] USER PERMISSIONS:",
      permissions
    )


    const result =
      dashboards

        // ====================================================
        // VALID
        // ====================================================

        .filter(
          dashboard =>
            dashboard &&
            dashboard.visible !== false
        )


        // ====================================================
        // PERMISSION
        // ====================================================

        .filter(
          dashboard => {

            const allowed =
              hasPermission(
                dashboard
              )


            console.log(
              `[RESAAS] ${dashboard.module}/${dashboard.name}:`,
              {
                permission:
                  dashboard.permission,

                permissionMode:
                  dashboard.permissionMode ||
                  "any",

                allowed
              }
            )


            return allowed

          }
        )


        // ====================================================
        // SORT
        // ====================================================

        .sort(
          (a, b) =>
            (a.order ?? 999) -
            (b.order ?? 999)
        )


        // ====================================================
        // NORMALIZE
        // ====================================================

        .map(
          (dashboard, index) => ({

            ...dashboard,

            key:
              `${dashboard.module || "dashboard"}::${dashboard.name || index}`,

            col:
              dashboard.col ||
              "col-12 col-md-6",

            component:
              normalizeComponent(
                dashboard.component
              )

          })
        )


    console.log(
      "[RESAAS] VISIBLE DASHBOARDS:",
      result
    )


    return result

  })

</script>