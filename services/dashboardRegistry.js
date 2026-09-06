import {
  shallowReactive
} from "vue"


// ============================================================
// REGISTRY
// ============================================================

const dashboards =
  shallowReactive([])


// ============================================================
// REGISTER DASHBOARD
// ============================================================

export function registerDashboard(
  dashboard
) {

  if (!dashboard) {
    return
  }


  // ----------------------------------------------------------
  // ARRAY
  // ----------------------------------------------------------

  if (
    Array.isArray(dashboard)
  ) {

    dashboard.forEach(
      item =>
        registerDashboard(item)
    )

    return
  }


  // ----------------------------------------------------------
  // VALIDATE
  // ----------------------------------------------------------

  if (!dashboard.name) {

    console.warn(
      "[RESAAS Dashboard] Dashboard sem name:",
      dashboard
    )

    return
  }


  // ----------------------------------------------------------
  // DUPLICATE
  // ----------------------------------------------------------

  const exists =
    dashboards.some(
      item =>
        item.name === dashboard.name &&
        item.module === dashboard.module
    )


  if (exists) {
    return
  }


  // ----------------------------------------------------------
  // ADD
  // ----------------------------------------------------------

  dashboards.push(
    dashboard
  )


  // ----------------------------------------------------------
  // SORT
  // ----------------------------------------------------------

  dashboards.sort(
    (a, b) =>
      (a.order ?? 999) -
      (b.order ?? 999)
  )

}


// ============================================================
// REGISTER DASHBOARDS
// ============================================================

export function registerDashboards(
  items
) {

  if (!items) {
    return
  }


  if (
    Array.isArray(items)
  ) {

    items.forEach(
      item =>
        registerDashboard(item)
    )

    return
  }


  registerDashboard(
    items
  )

}


// ============================================================
// GET DASHBOARDS
// ============================================================

export function getDashboards() {

  return dashboards

}


// ============================================================
// CLEAR
// ============================================================

export function clearDashboards() {

  dashboards.splice(
    0,
    dashboards.length
  )

}