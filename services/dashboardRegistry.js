const dashboards = []


export function registerDashboard(dashboard) {

  if (!dashboard) {
    return
  }

  if (Array.isArray(dashboard)) {
    dashboard.forEach(registerDashboard)
    return
  }

  const exists = dashboards.some(
    item =>
      item.name === dashboard.name &&
      item.module === dashboard.module
  )

  if (exists) {
    return
  }

  dashboards.push(dashboard)

  dashboards.sort(
    (a, b) =>
      (a.order ?? 999) -
      (b.order ?? 999)
  )
}


export function registerDashboards(dashboards) {

  if (!dashboards) {
    return
  }

  if (Array.isArray(dashboards)) {
    dashboards.forEach(registerDashboard)
    return
  }

  registerDashboard(dashboards)
}


export function getDashboards() {
  return dashboards
}


export function clearDashboards() {
  dashboards.splice(0)
}