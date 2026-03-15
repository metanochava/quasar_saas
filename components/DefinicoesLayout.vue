<template>
  <q-card>
    <q-bar class="bg-primary text-white">
      <div class="text-h6">🎨 Theme Studio</div>

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
        <div class="col-12 col-md-4">
          <q-tabs v-model="tab" dense align="justify">
            <q-tab name="cores" icon="palette" label="Cores" />
            <q-tab name="font" icon="font_download" label="Font" />
            <q-tab name="layout" icon="dashboard_customize" label="Layout" />
            <q-tab name="animation" icon="animation" label="Animation" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="cores">
              <q-input
                v-model="search"
                dense
                outlined
                placeholder="Pesquisar cor..."
                class="q-mb-md"
                clearable
              >
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>

              <div class="row q-col-gutter-sm">
                <div
                  v-for="(value, key) in filteredColors"
                  :key="key"
                  class="col-6"
                >
                  <q-card flat bordered class="cursor-pointer" @click="openColor(key)">
                    <q-card-section class="q-pa-sm">
                      <div class="text-caption">{{ key }}</div>

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

            <q-tab-panel name="font">
              <q-card bordered>
                <q-card-section class="text-subtitle1">
                  Tipografia
                </q-card-section>

                <q-card-section class="q-gutter-md">
                  <q-select
                    v-model="User.Typography.font_family"
                    :options="fontOptions"
                    label="Font Family"
                    dense
                    outlined
                  />

                  <q-input v-model.number="User.Typography.font_size_base" label="Font Base" type="number" dense outlined />
                  <q-input v-model.number="User.Typography.font_size_h1" label="H1" type="number" dense outlined />
                  <q-input v-model.number="User.Typography.font_size_h2" label="H2" type="number" dense outlined />
                  <q-input v-model.number="User.Typography.font_size_h3" label="H3" type="number" dense outlined />
                  <q-input v-model.number="User.Typography.font_size_h4" label="H4" type="number" dense outlined />
                  <q-input v-model.number="User.Typography.font_size_h5" label="H5" type="number" dense outlined />
                  <q-input v-model.number="User.Typography.font_size_h6" label="H6" type="number" dense outlined />

                  <q-input v-model.number="User.Typography.font_weight_normal" label="Peso normal" type="number" dense outlined />
                  <q-input v-model.number="User.Typography.font_weight_bold" label="Peso bold" type="number" dense outlined />
                  <q-input v-model.number="User.Typography.line_height" label="Line height" type="number" step="0.1" dense outlined />
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <q-tab-panel name="layout">
              <q-card bordered class="q-mb-md">
                <q-card-section class="text-subtitle1">
                  Botões
                </q-card-section>

                <q-card-section class="q-gutter-md">
                  <q-select
                    v-model="User.LayoutSettings.button_style"
                    :options="buttonStyleOptions"
                    label="Estilo"
                    dense
                    outlined
                  />

                  <q-toggle v-model="User.LayoutSettings.button_dense" label="Dense" />
                  <q-toggle v-model="User.LayoutSettings.button_round" label="Round" />
                </q-card-section>
              </q-card>

              <q-card bordered class="q-mb-md">
                <q-card-section class="text-subtitle1">
                  Inputs
                </q-card-section>

                <q-card-section class="q-gutter-md">
                  <q-select
                    v-model="User.LayoutSettings.input_style"
                    :options="inputStyleOptions"
                    label="Estilo"
                    dense
                    outlined
                  />

                  <q-toggle v-model="User.LayoutSettings.input_dense" label="Dense" />
                </q-card-section>
              </q-card>

              <q-card bordered class="q-mb-md">
                <q-card-section class="text-subtitle1">
                  Cards
                </q-card-section>

                <q-card-section class="q-gutter-md">
                  <q-toggle v-model="User.LayoutSettings.card_flat" label="Flat" />
                  <q-toggle v-model="User.LayoutSettings.card_bordered" label="Bordered" />
                  <q-toggle v-model="User.LayoutSettings.rounded" label="Rounded global" />
                  <q-toggle v-model="User.LayoutSettings.square" label="Square global" />
                </q-card-section>
              </q-card>

              <q-card bordered>
                <q-card-section class="text-subtitle1">
                  Sidebar / Toolbar
                </q-card-section>

                <q-card-section class="q-gutter-md">
                  <q-toggle v-model="User.LayoutSettings.sidebar_mini" label="Mini sidebar" />

                  <q-input
                    v-model.number="User.LayoutSettings.sidebar_width"
                    label="Sidebar width"
                    type="number"
                    outlined
                    dense
                  />

                  <q-toggle v-model="User.LayoutSettings.toolbar_dense" label="Toolbar dense" />
                  <q-toggle v-model="User.LayoutSettings.toolbar_elevated" label="Toolbar elevated" />
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <q-tab-panel name="animation">
              <q-card bordered>
                <q-card-section class="text-subtitle1">
                  Animation
                </q-card-section>

                <q-card-section class="q-gutter-md">
                  <q-toggle
                    v-model="User.AnimationSetting.enable_animations"
                    label="Enable animations"
                  />

                  <q-select
                    v-model="User.AnimationSetting.animation_speed"
                    :options="['slow','normal','fast']"
                    label="Animation speed"
                    dense
                    outlined
                  />

                  <q-select
                    v-model="User.AnimationSetting.page_transition"
                    :options="['fade','slide-left','slide-right','scale']"
                    label="Page transition"
                    dense
                    outlined
                  />

                  <q-select
                    v-model="User.AnimationSetting.button_animation"
                    :options="['none','ripple','pulse']"
                    label="Button animation"
                    dense
                    outlined
                  />

                  <q-toggle
                    v-model="User.AnimationSetting.hover_effect"
                    label="Hover effect"
                  />

                  <q-select
                    v-model="User.AnimationSetting.hover_style"
                    :options="['lift','shadow','grow']"
                    label="Hover style"
                    dense
                    outlined
                  />

                  <q-select
                    v-model="User.AnimationSetting.card_animation"
                    :options="['none','fade','slide-up']"
                    label="Card animation"
                    dense
                    outlined
                  />

                  <q-select
                    v-model="User.AnimationSetting.modal_animation"
                    :options="['none','scale','fade']"
                    label="Modal animation"
                    dense
                    outlined
                  />
                </q-card-section>
              </q-card>
            </q-tab-panel>
          </q-tab-panels>
        </div>

        <div class="col-12 col-md-8">
          <div :class="previewMode === 'mobile' ? 'mobile-frame' : ''">
            <q-layout view="hHh lpR fFf" container style="height:700px">
              <q-header bordered class="bg-primary text-white">
                <q-toolbar
                  :dense="ps.layout?.toolbar_dense"
                  :class="ps.layout?.toolbar_elevated ? 'shadow-2' : ''"
                >
                  <TBtn flat round icon="menu" />
                  <q-toolbar-title>Preview</q-toolbar-title>
                </q-toolbar>
              </q-header>

              <TDrawer
                show-if-above
                bordered
                :mini="ps.layout?.sidebar_mini"
                :width="ps.layout?.sidebar_width"
              >
                <q-list>
                  <q-item clickable>
                    <q-item-section avatar>
                      <q-icon name="home" />
                    </q-item-section>
                    <q-item-section>Dashboard</q-item-section>
                  </q-item>
                </q-list>
              </TDrawer>

              <q-page-container>
                <q-page class="q-pa-md">
                  <TCard class="q-mb-md">
                    <q-card-section class="bg-secondary text-white">
                      Card Preview
                    </q-card-section>

                    <q-card-section>
                      <TInput
                        label="Nome"
                        v-model="previewForm.name"
                      />

                      <div class="q-mt-md">
                        <TBtn
                          color="primary"
                          label="Primário"
                        />
                      </div>
                    </q-card-section>
                  </TCard>

                  <TCard class="q-mb-md">
                    <q-card-section>
                      <div :style="headingStyle">Título H1 Preview</div>
                      <div :style="bodyStyle" class="q-mt-sm">
                        Texto base vindo da tipografia configurada.
                      </div>
                    </q-card-section>
                  </TCard>
                </q-page>
              </q-page-container>
            </q-layout>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>

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
        <q-btn color="primary" label="Aplicar" @click="applyColor" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, h } from "vue"
import { Dark, setCssVar } from "quasar"
import { HTTPAuth, url } from "../boot/api"
import { UserStore } from "../stores/AuthStore"

export default defineComponent({
  name: "ThemeStudioEngine",

  components: {
    TBtn: defineComponent({
      name: "TBtn",
      inheritAttrs: false,
      setup(props, { attrs, slots }) {
        const User = UserStore()
        return () => {
          const ps = User.ps || {}
          const layout = ps.layout || {}
          const animation = ps.animation || {}

          return h(
            "q-btn",
            {
              ...attrs,
              dense: attrs.dense ?? layout.button_dense,
              round: attrs.round ?? layout.button_round,
              rounded: attrs.rounded ?? layout.rounded,
              square: attrs.square ?? layout.square,
              flat: attrs.flat ?? layout.button_style === "flat",
              outline: attrs.outline ?? layout.button_style === "outline",
              unelevated: attrs.unelevated ?? layout.button_style === "unelevated",
              push: attrs.push ?? layout.button_style === "push",
              ripple: attrs.ripple ?? animation.button_animation === "ripple",
              class: [
                attrs.class,
                animation.hover_effect ? `hover-${animation.hover_style}` : ""
              ]
            },
            slots
          )
        }
      }
    }),

    TInput: defineComponent({
      name: "TInput",
      inheritAttrs: false,
      emits: ["update:modelValue"],
      props: {
        modelValue: {
          type: [String, Number, null],
          default: ""
        }
      },
      setup(props, { attrs, emit, slots }) {
        const User = UserStore()
        return () => {
          const ps = User.ps || {}
          const layout = ps.layout || {}

          return h(
            "q-input",
            {
              ...attrs,
              modelValue: props.modelValue,
              "onUpdate:modelValue": (val) => emit("update:modelValue", val),
              dense: attrs.dense ?? layout.input_dense,
              outlined: attrs.outlined ?? layout.input_style === "outlined",
              filled: attrs.filled ?? layout.input_style === "filled",
              standout: attrs.standout ?? layout.input_style === "standout",
              rounded: attrs.rounded ?? layout.rounded,
              square: attrs.square ?? layout.square
            },
            slots
          )
        }
      }
    }),

    TCard: defineComponent({
      name: "TCard",
      inheritAttrs: false,
      setup(props, { attrs, slots }) {
        const User = UserStore()
        return () => {
          const ps = User.ps || {}
          const layout = ps.layout || {}
          const animation = ps.animation || {}

          return h(
            "q-card",
            {
              ...attrs,
              flat: attrs.flat ?? layout.card_flat,
              bordered: attrs.bordered ?? layout.card_bordered,
              class: [
                attrs.class,
                animation.card_animation && animation.card_animation !== "none"
                  ? `anim-${animation.card_animation}`
                  : ""
              ],
              style: {
                ...(attrs.style || {}),
                borderRadius: layout.square
                  ? "0px"
                  : layout.rounded
                    ? "16px"
                    : "4px"
              }
            },
            slots
          )
        }
      }
    }),

    TDrawer: defineComponent({
      name: "TDrawer",
      inheritAttrs: false,
      setup(props, { attrs, slots }) {
        const User = UserStore()
        return () => {
          const ps = User.ps || {}
          const layout = ps.layout || {}

          return h(
            "q-drawer",
            {
              ...attrs,
              mini: attrs.mini ?? layout.sidebar_mini,
              width: attrs.width ?? layout.sidebar_width
            },
            slots
          )
        }
      }
    })
  },

  setup() {
    const User = UserStore()
    return { User }
  },

  data() {
    return {
      tab: "cores",
      search: "",
      colorDialog: false,
      selectedKey: null,
      tempColor: "#1976D2",
      previewMode: "desktop",
      darkMode: false,
      previewForm: { name: "" },
      fontOptions: [
        "Roboto", "Inter", "Open Sans", "Lato", "Poppins",
        "Montserrat", "Nunito", "Source Sans Pro"
      ],
      buttonStyleOptions: ["flat", "outline", "unelevated", "push"],
      inputStyleOptions: ["outlined", "filled", "standout"]
    }
  },

  computed: {
    ps() {
      return this.User.ps || {
        theme: {},
        layout: {},
        animation: {},
        typography: {}
      }
    },

    filteredColors() {
      const result = {}
      Object.entries(this.User.Theme || {}).forEach(([key, value]) => {
        if (key.toLowerCase().includes(this.search.toLowerCase())) {
          result[key] = value
        }
      })
      return result
    },

    headingStyle() {
      return {
        fontFamily: this.ps.typography?.font_family || "Roboto",
        fontSize: `${this.ps.typography?.font_size_h1 || 32}px`,
        fontWeight: this.ps.typography?.font_weight_bold || 700,
        lineHeight: this.ps.typography?.line_height || 1.5,
        letterSpacing: `${this.ps.typography?.letter_spacing || 0}px`,
        textTransform: this.ps.typography?.uppercase_headings ? "uppercase" : "none"
      }
    },

    bodyStyle() {
      return {
        fontFamily: this.ps.typography?.font_family || "Roboto",
        fontSize: `${this.ps.typography?.font_size_body || 14}px`,
        fontWeight: this.ps.typography?.font_weight_normal || 400,
        lineHeight: this.ps.typography?.line_height || 1.5
      }
    }
  },

  mounted() {
    Object.entries(this.User.Theme || {}).forEach(([k, v]) => {
      if (typeof v === "string") {
        setCssVar(k, v)
      }
    })

    this.darkMode = this.$q.dark.isActive
    this.applyTypography()
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

    applyTypography() {
      if (this.User.Typography?.font_family) {
        document.body.style.fontFamily = this.User.Typography.font_family
      }
      if (this.User.Typography?.font_size_base) {
        document.body.style.fontSize = `${this.User.Typography.font_size_base}px`
      }
      if (this.User.Typography?.line_height) {
        document.body.style.lineHeight = this.User.Typography.line_height
      }
    },

    async saveTheme() {
      this.applyTypography()

      await HTTPAuth.put(url({
        type: "u",
        url: `/api/django_resaas/entidades/${this.User.Entidade.id}/themePut/`
      }), this.User.Theme)

      await HTTPAuth.put(url({
        type: "u",
        url: `/api/django_resaas/entidades/${this.User.Entidade.id}/layoutSettingsPut/`
      }), this.User.LayoutSettings)

      await HTTPAuth.put(url({
        type: "u",
        url: `/api/django_resaas/entidades/${this.User.Entidade.id}/typographyPut/`
      }), this.User.Typography)

      await HTTPAuth.put(url({
        type: "u",
        url: `/api/django_resaas/entidades/${this.User.Entidade.id}/animationSettingsPut/`
      }), this.User.AnimationSetting)
    }
  },

  watch: {
    "User.Typography.font_family"() {
      this.applyTypography()
    },
    "User.Typography.font_size_base"() {
      this.applyTypography()
    },
    "User.Typography.line_height"() {
      this.applyTypography()
    }
  }
})
</script>

<style scoped>
.mobile-frame {
  max-width: 390px;
  margin: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active {
  transition: all .3s;
}
.slide-left-enter-from {
  transform: translateX(40px);
  opacity: 0;
}

.hover-lift:hover {
  transform: translateY(-4px);
  transition: all .2s;
}

.hover-shadow:hover {
  box-shadow: 0 10px 25px rgba(0,0,0,.2);
  transition: all .2s;
}

.hover-grow:hover {
  transform: scale(1.05);
  transition: all .2s;
}

.anim-fade {
  animation: fadeCard .35s ease;
}

@keyframes fadeCard {
  from { opacity: 0; }
  to { opacity: 1; }
}

.anim-slide-up {
  animation: slideUp .35s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(16px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>