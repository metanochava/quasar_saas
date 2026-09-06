<template>
  <q-page class="column full-height">
    <div class="q-pa-sm">
      <div class="row q-col-gutter-sm items-center">
        <div class="col">
          <q-input
            v-model="Permission.search"
            dense
            outlined
            label="Search"
            @update:model-value="Permission.buildApps"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="col-auto">
          <q-badge color="primary" outline class="q-pa-sm">
            {{ Permission.groupPermissions.length }} permissions
          </q-badge>
        </div>
      </div>
    </div>

    <q-separator />

    <div class="col scroll q-pa-sm">
      <q-card
        v-for="(models, appName) in Permission.apps"
        :key="appName"
        class="q-mb-sm"
        flat
        bordered
      >
        <q-expansion-item expand-separator>
          <template #header>
            <q-item-section avatar>
              <q-checkbox
                :model-value="Permission.appState(models).checked"
                :indeterminate="Permission.appState(models).indeterminate"
                :disable="Permission.loadingPermission"
                @update:model-value="Permission.toggleApp(models, $event)"
              />
            </q-item-section>

            <q-item-section>
              <div class="text-bold text-primary">{{ appName }}</div>
              <div class="text-caption text-grey">
                {{ Object.keys(models).length }} models
              </div>
            </q-item-section>
          </template>

          <div
            v-for="(perms, modelName) in models"
            :key="modelName"
            class="q-pa-sm"
          >
            <div class="row items-center">
              <div class="col-12 text-center">
                <q-checkbox
                  :model-value="Permission.modelState(perms).checked"
                  :indeterminate="Permission.modelState(perms).indeterminate"
                  :disable="Permission.loadingPermission"
                  @update:model-value="Permission.toggleModel(perms, $event)"
                >
                  <div class="text-bold">
                    {{ modelName }}
                    <span class="text-grey">
                      {{ perms.length }} permissions
                    </span>
                  </div>
                </q-checkbox>
              </div>

              <div class="col-12 row q-gutter-sm">
                <q-checkbox
                  v-for="perm in orderPermissions(perms)"
                  :key="perm.id"
                  :model-value="Permission.hasPermission(perm.id)"
                  :label="label(perm.codename, modelName)"
                  :disable="Permission.loadingPermission"
                  dense
                  @update:model-value="Permission.toggle(perm)"
                />
              </div>
            </div>

            <q-separator class="q-my-sm" />
          </div>
        </q-expansion-item>
      </q-card>
    </div>

    <q-separator />

    <div class="q-pa-sm row items-center q-gutter-sm">
      <div class="col">
        <div
          v-if="Permission.dirty"
          class="text-caption text-orange text-weight-medium"
        >
          <q-icon name="edit" class="q-mr-xs" />
          Unsaved permission changes
        </div>

        <div v-else class="text-caption text-positive">
          <q-icon name="check_circle" class="q-mr-xs" />
          Permissions saved
        </div>
      </div>

      <div class="col-auto">
        <q-btn
          flat
          no-caps
          icon="undo"
          label="Cancel changes"
          color="grey-7"
          :disable="!Permission.dirty || Permission.loadingPermission"
          @click="Permission.resetChanges"
        />
      </div>

      <div class="col-auto">
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="save"
          label="Save permissions"
          :loading="Permission.loadingPermission"
          :disable="!Permission.dirty || Permission.loadingPermission"
          @click="save"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { watch } from 'vue'
import { usePermissionStore } from '../../stores/PermissionStore'

const props = defineProps({
  AllPermissions: {
    type: Array,
    default: () => []
  },
  GroupPermissionsRe: {
    type: Array,
    default: () => []
  },
  Group: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['saved'])
const Permission = usePermissionStore()

watch(
  () => [
    props.AllPermissions,
    props.GroupPermissionsRe,
    props.Group
  ],
  ([allPermissions, groupPermissions, group]) => {
    Permission.initPermissions(
      allPermissions,
      groupPermissions,
      group
    )
  },
  { immediate: true }
)

async function save() {
  if (await Permission.saveGroupPermissions()) {
    emit('saved', [...Permission.groupPermissions])
  }
}

const permissionOrder = [
  'add',
  'view',
  'change',
  'delete',
  'list',
  'pdf'
]

function orderPermissions(permissions) {
  return [...permissions].sort(
    (a, b) =>
      permissionOrder.findIndex((item) =>
        a.codename.includes(item)
      ) -
      permissionOrder.findIndex((item) =>
        b.codename.includes(item)
      )
  )
}

function label(codename, modelName) {
  const model = (modelName || '')
    .replaceAll(' ', '')
    .toLowerCase()

  return (codename || '')
    .toLowerCase()
    .replace(model, '')
    .replace(/_$/, '')
}
</script>