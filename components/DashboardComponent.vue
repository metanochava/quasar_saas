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


          <!-- COMPONENTE DO DASHBOARD -->

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
              Componente não definido.
            </div>

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
// NORMALIZE COMPONENT
// ============================================================

const normalizeComponent = component => {

  if (!component) {
    return null
  }


  // ----------------------------------------------------------
  // LAZY IMPORT
  //
  // component: () => import("./Dashboard.vue")
  // ----------------------------------------------------------

  if (
    typeof component === "function"
  ) {

    if (
      componentCache.has(component)
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


  // ----------------------------------------------------------
  // COMPONENTE NORMAL
  // ----------------------------------------------------------

  return markRaw(
    component
  )

}


// ============================================================
// DEBUG PERMISSIONS
// ============================================================

const debugPermissions = dashboard => {

  const permissions =
    dashboard.permission


  // ----------------------------------------------------------
  // SEM PERMISSÃO
  // ----------------------------------------------------------

  if (
    permissions === null ||
    permissions === undefined ||
    permissions === ""
  ) {

    console.log(
      `[RESAAS] ${dashboard.name} sem restrição de permissão`
    )

    return

  }


  // ----------------------------------------------------------
  // STRING
  // ----------------------------------------------------------

  if (
    typeof permissions === "string"
  ) {

    console.log(
      `[RESAAS] CAN ${permissions}:`,
      User.can(permissions)
    )

    return

  }


  // ----------------------------------------------------------
  // ARRAY
  // ----------------------------------------------------------

  if (
    Array.isArray(permissions)
  ) {

    console.log(
      `[RESAAS] PERMISSIONS ${dashboard.name}:`,
      permissions
    )


    console.log(
      `[RESAAS] CAN ${dashboard.name}:`,
      permissions.map(
        permission => ({
          permission,
          can: User.can(permission)
        })
      )
    )

  }

}


// ============================================================
// DASHBOARDS VISÍVEIS
// ============================================================

const visibleDashboards =
  computed(() => {

    const dashboards =
      getDashboards()


    console.log(
      "[RESAAS] REGISTRY:",
      dashboards
    )


    const result =
      dashboards.map(
        (dashboard, index) => {

          console.log(
            "[RESAAS] DASHBOARD:",
            dashboard
          )


          // --------------------------------------------------
          // DEBUG DAS PERMISSÕES
          //
          // IMPORTANTE:
          // ainda NÃO estamos a filtrar por permissão.
          // --------------------------------------------------

          debugPermissions(
            dashboard
          )


          // --------------------------------------------------
          // NORMALIZE
          // --------------------------------------------------

          return {

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

          }

        }
      )


    console.log(
      "[RESAAS] RESULT:",
      result
    )


    return result

  })

</script>