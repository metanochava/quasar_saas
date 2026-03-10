<template>

  <q-card>

    <!-- HEADER -->
    <q-bar class="bg-primary text-white">

      <div class="text-h6">
        🎨 Theme Studio
      </div>

      <q-space />

      <q-toggle
        v-model="darkMode"
        label="Dark"
        @update:model-value="applyDarkMode"
      />

      <q-btn-toggle
        v-model="previewMode"
        dense
        toggle-color="white"
        :options="[
          { label: 'Desktop', value: 'desktop' },
          { label: 'Mobile', value: 'mobile' }
        ]"
      />

      <q-btn flat dense icon="save" label="Salvar" @click="saveTheme" />
      <q-btn flat dense icon="close" v-close-popup />

    </q-bar>


    <q-card-section class="q-pa-md">

      <div class="row q-col-gutter-lg">

        <!-- EDITOR -->
        <div class="col-12 col-md-4">

          <q-tabs
            v-model="tab"
            dense
            indicator-color="primary"
            align="justify"
          >
            <q-tab name="cores" icon="palette" label="Cores" />
            <q-tab name="layout" icon="dashboard_customize" label="Layout" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>

            <!-- TAB CORES -->
            <q-tab-panel name="cores">

              <!-- SEARCH -->
              <q-input
                v-model="search"
                dense
                outlined
                placeholder="Pesquisar cor..."
                class="q-mb-md"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>

              <div class="row q-col-gutter-sm">

                <div
                  v-for="(value, key) in filteredColors"
                  :key="key"
                  class="col-6"
                  v-show="!['id'].includes(key)"
                >

                  <q-card
                    bordered
                    flat
                    class="cursor-pointer"
                    @click="openColor(key)"
                  >

                    <q-card-section class="q-pa-sm">

                      <div class="text-caption">
                        {{ key }}
                      </div>

                      <div
                        class="q-mt-sm"
                        :style="{
                          background: value,
                          height: '40px',
                          borderRadius: '6px'
                        }"
                      />

                      <div class="text-caption q-mt-xs">
                        {{ value }}
                      </div>

                    </q-card-section>

                  </q-card>

                </div>

              </div>

            </q-tab-panel>


            <!-- TAB LAYOUT -->
            <q-tab-panel name="layout">

              <!-- BOTÕES -->
              <q-card bordered class="q-mb-md">

                <q-card-section class="text-subtitle1">
                  Botões
                </q-card-section>

                <q-card-section class="q-gutter-md">

                  <q-select
                    v-model="User.LayoutSettings.buttonStyle"
                    :options="buttonStyleOptions"
                    label="Estilo"
                    dense
                    outlined
                  />

                  <q-toggle
                    v-model="User.LayoutSettings.buttonDense"
                    label="Dense"
                  />

                  <q-toggle
                    v-model="User.LayoutSettings.buttonRounded"
                    label="Rounded"
                  />

                </q-card-section>

              </q-card>


              <!-- INPUTS -->
              <q-card bordered class="q-mb-md">

                <q-card-section class="text-subtitle1">
                  Inputs
                </q-card-section>

                <q-card-section class="q-gutter-md">

                  <q-select
                    v-model="User.LayoutSettings.inputStyle"
                    :options="inputStyleOptions"
                    label="Estilo"
                    dense
                    outlined
                  />

                  <q-toggle
                    v-model="User.LayoutSettings.inputDense"
                    label="Dense"
                  />

                </q-card-section>

              </q-card>


              <!-- SIDEBAR -->
              <q-card bordered>

                <q-card-section class="text-subtitle1">
                  Sidebar
                </q-card-section>

                <q-card-section class="q-gutter-md">

                  <q-toggle
                    v-model="User.LayoutSettings.sidebar_mini"
                    label="Mini sidebar"
                  />

                  <q-input
                    v-model.number="User.LayoutSettings.sidebar_width"
                    type="number"
                    label="Sidebar width"
                    outlined
                    dense
                  />

                </q-card-section>

              </q-card>

            </q-tab-panel>

          </q-tab-panels>

        </div>


        <!-- PREVIEW -->
        <div class="col-12 col-md-8">

          <div :class="previewMode === 'mobile' ? 'mobile-frame' : ''">

            <q-layout
              view="hHh lpR fFf"
              container
              style="height:700px"
              class="shadow-2 rounded-borders"
            >

              <q-header bordered class="bg-primary text-white">

                <q-toolbar :dense="User.LayoutSettings.toolbarDense">

                  <q-btn flat dense round icon="menu" />

                  <q-toolbar-title>
                    Preview
                  </q-toolbar-title>

                </q-toolbar>

              </q-header>


              <q-drawer
                show-if-above
                bordered
                :mini="User.LayoutSettings.sidebar_mini"
                :width="User.LayoutSettings.sidebar_width"
              >

                <q-list>

                  <q-item clickable>

                    <q-item-section avatar>
                      <q-icon name="home" />
                    </q-item-section>

                    <q-item-section>
                      Dashboard
                    </q-item-section>

                  </q-item>

                </q-list>

              </q-drawer>


              <q-page-container>

                <q-page class="q-pa-md">

                  <q-card class="q-mb-md">

                    <q-card-section class="bg-secondary text-white">
                      Card Preview
                    </q-card-section>

                    <q-card-section>

                      <q-input
                        label="Nome"
                        v-model="previewForm.name"
                        :dense="User.LayoutSettings.inputDense"
                        :outlined="User.LayoutSettings.inputStyle === 'outlined'"
                        :filled="User.LayoutSettings.inputStyle === 'filled'"
                      />

                      <div class="q-mt-md">

                        <q-btn
                          color="primary"
                          label="Primário"
                          :flat="User.LayoutSettings.buttonStyle === 'flat'"
                          :outline="User.LayoutSettings.buttonStyle === 'outline'"
                          :unelevated="User.LayoutSettings.buttonStyle === 'unelevated'"
                          :dense="User.LayoutSettings.buttonDense"
                          :rounded="User.LayoutSettings.buttonRounded"
                        />

                      </div>

                    </q-card-section>

                  </q-card>

                </q-page>

              </q-page-container>

            </q-layout>

          </div>

        </div>

      </div>

    </q-card-section>

  </q-card>


  <!-- MODAL COR -->
  <q-dialog v-model="colorDialog">

    <q-card style="min-width:350px">

      <q-card-section>
        Alterar cor: {{ selectedKey }}
      </q-card-section>

      <q-card-section>

        <q-color
          v-model="tempColor"
          format-model="hex"
          @update:model-value="previewColor"
        />

      </q-card-section>

      <q-card-actions align="right">

        <q-btn flat label="Cancelar" v-close-popup />

        <q-btn
          color="primary"
          label="Aplicar"
          @click="applyColor"
        />

      </q-card-actions>

    </q-card>

  </q-dialog>

</template>


<script>
import { defineComponent } from 'vue'
import { Dark, setCssVar } from 'quasar'
import { HTTPAuth, url } from '../boot/api'
import { UserStore } from '../stores/AuthStore'

export default defineComponent({

  setup() {
    const User = UserStore()
    return { User }
  },

  data() {
    return {
      tab: 'cores',
      search: '',
      colorDialog: false,
      selectedKey: null,
      tempColor: '#1976D2',
      previewMode: 'desktop',
      darkMode: false,

      previewForm: {
        name: '',
        email: ''
      },

      ignore: [
        'id',
        'deleted_at',
        'created_at',
        'updated_at',
        'estado',
        'created_by',
        'updated_by',
        'nome'
      ],

      buttonStyleOptions: [
        'flat',
        'outline',
        'unelevated',
        'push'
      ],

      inputStyleOptions: [
        'outlined',
        'filled',
        'standout'
      ]
    }
  },

  computed: {

    filteredColors() {

      const result = {}

      Object.entries(this.User.Theme || {}).forEach(([key, value]) => {

        if (
          !this.ignore.includes(key) &&
          key.toLowerCase().includes(this.search.toLowerCase())
        ) {
          result[key] = value
        }

      })

      return result
    }

  },

  mounted() {

    Object.entries(this.User.Theme).forEach(([k, v]) => {

      if (typeof v === 'string') {
        setCssVar(k, v)
      }

    })

    this.darkMode = this.$q.dark.isActive
  },

  methods: {

    openColor(key) {
      this.selectedKey = key
      this.tempColor = this.User.Theme[key]
      this.colorDialog = true
    },

    previewColor(color) {
      setCssVar(this.selectedKey, color)
    },

    applyColor() {

      this.User.Theme[this.selectedKey] = this.tempColor
      setCssVar(this.selectedKey, this.tempColor)

      this.colorDialog = false
    },

    applyDarkMode(val) {
      Dark.set(val)
    },

    async saveTheme() {

      try {
        await HTTPAuth.put(
          url({ type: 'u', url: '/api/django_resaas/entidades/' + this.User.Entidade.id+ '/themePut/',  params: {} }), this.User.Theme)

        await HTTPAuth.put(
          url({ type: 'u', url: '/api/django_resaas/entidades/' + this.User.Entidade.id+ '/layoutSettingsPut/',  params: {} }), this.User.LayoutSettings)
      } catch (e) {
      }

    }

  }

})
</script>


<style scoped>

.mobile-frame {
  max-width: 390px;
  margin: auto;
}

</style>
