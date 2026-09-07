<template>

  <q-page class="q-pa-sm">

    <!-- ===================================================== -->
    <!-- DASHBOARDS -->
    <!-- ===================================================== -->

    <div
      v-if="visibleDashboards.length"
      class="row q-col-gutter-sm"
    >
      <div
        v-for="dashboard in visibleDashboards"
        :key="dashboard.key"
        :class="dashboard.col"
      >
        <component
          v-if="dashboard.component"
          :is="dashboard.component"
          :dashboard="dashboard"
        />
      </div>
    </div>


    <!-- ===================================================== -->
    <!-- SEM DASHBOARDS -->
    <!-- ===================================================== -->


      <div
        v-else
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
// PERMISSION
// ============================================================

const hasPermission = dashboard => {

  const permission =
    dashboard.permission


  // ----------------------------------------------------------
  // SEM PERMISSÃO
  // ----------------------------------------------------------

  if (
    permission === null ||
    permission === undefined ||
    permission === ""
  ) {
    return true
  }


  // ----------------------------------------------------------
  // STRING
  // ----------------------------------------------------------

  if (
    typeof permission === "string"
  ) {

    return User.can(
      permission
    )

  }


  // ----------------------------------------------------------
  // ARRAY
  // ----------------------------------------------------------

  if (
    Array.isArray(permission)
  ) {

    if (!permission.length) {
      return true
    }


    // --------------------------------------------------------
    // ALL
    //
    // Todas as permissões são obrigatórias
    // --------------------------------------------------------

    if (
      dashboard.permissionMode === "all"
    ) {

      return permission.every(
        item =>
          User.can(item)
      )

    }


    // --------------------------------------------------------
    // ANY - DEFAULT
    //
    // Basta possuir uma das permissões
    // --------------------------------------------------------

    return permission.some(
      item =>
        User.can(item)
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
  // COMPONENTE JÁ IMPORTADO
  // ----------------------------------------------------------

  return markRaw(
    component
  )

}


// ============================================================
// DASHBOARDS VISÍVEIS
// ============================================================

const visibleDashboards =
  computed(() => {

    return getDashboards()

      // ------------------------------------------------------
      // VÁLIDO / VISÍVEL
      // ------------------------------------------------------

      .filter(
        dashboard =>
          dashboard &&
          dashboard.visible !== false
      )


      // ------------------------------------------------------
      // PERMISSÕES
      // ------------------------------------------------------

      .filter(
        dashboard =>
          hasPermission(
            dashboard
          )
      )


      // ------------------------------------------------------
      // ORDER
      // ------------------------------------------------------

      .sort(
        (a, b) =>
          (a.order ?? 999) -
          (b.order ?? 999)
      )


      // ------------------------------------------------------
      // NORMALIZE
      // ------------------------------------------------------

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