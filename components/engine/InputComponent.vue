<template>
  <q-input
    v-bind="inputAttrs"
    v-model="localValue"
    :type="computedType"
    :label="translatedLabel"
    :placeholder="translatedPlaceholder"
    :hint="translatedHint"
    :error="hasError"
    :error-message="firstError"
    :mask="computedMask"
    :rules="computedRules"
    :dense="attrs.dense ?? layout.input_dense"
    :outlined="attrs.outlined ?? layout.input_style === 'outlined'"
    :filled="attrs.filled ?? layout.input_style === 'filled'"
    :standout="attrs.standout ?? layout.input_style === 'standout'"
    :class="attrs.class"
    :style="radiusStyle"
  >
    <template v-if="isPassword" #append>
      <q-icon
        :name="showPassword ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="togglePassword"
      />
    </template>

    <template v-if="attrs.type === 'search'" #prepend>
      <q-icon name="search" />
    </template>

    <slot />
  </q-input>
</template>

<script>
import { defineComponent, computed, useAttrs, ref, watch } from "vue"
import { UserStore } from "../../stores/AuthStore"
import { tdc } from "../../boot/base"

export default defineComponent({
  name: "s-input",
  inheritAttrs: false,

  props: {
    modelValue: [String, Number, null],
    type: {
      type: String,
      default: "text"
    },
    label: String,
    placeholder: String,
    hint: String,
    required: Boolean,
    mask: String,
    validators: {
      type: Array,
      default: () => []
    }
  },

  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const attrs = useAttrs()
    const User = UserStore()

    const layout = computed(() => User.ps?.layout || {})
    const localValue = ref(props.modelValue)
    const showPassword = ref(false)

    watch(
      () => props.modelValue,
      v => {
        localValue.value = v
      }
    )

    watch(localValue, v => {
      emit("update:modelValue", v)
    })

    const isPassword = computed(() => props.type === "password")

    const computedType = computed(() => {
      if (props.type === "password") {
        return showPassword.value ? "text" : "password"
      }
      if (props.type === "phone") return "tel"
      if (props.type === "currency") return "text"
      return props.type || "text"
    })

    const computedMask = computed(() => {
      if (props.mask) return props.mask
      if (props.type === "phone") return "(##) #####-####"
      if (props.type === "date") return "####-##-##"
      return undefined
    })

    const computedRules = computed(() => {
      const rules = []

      if (props.required) {
        rules.push(v => !!v || tdc("Campo obrigatório"))
      }

      if (props.type === "email") {
        rules.push(v => {
          if (!v) return true
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || tdc("Email inválido")
        })
      }

      if (props.type === "number") {
        rules.push(v => {
          if (v === null || v === undefined || v === "") return true
          return !isNaN(Number(v)) || tdc("Valor inválido")
        })
      }

      for (const validator of props.validators) {
        rules.push(validator)
      }

      return rules
    })

    const translatedLabel = computed(() =>
      props.label ? tdc(props.label) : attrs.label ? tdc(attrs.label) : undefined
    )

    const translatedPlaceholder = computed(() =>
      props.placeholder
        ? tdc(props.placeholder)
        : attrs.placeholder
          ? tdc(attrs.placeholder)
          : undefined
    )

    const translatedHint = computed(() =>
      props.hint ? tdc(props.hint) : attrs.hint ? tdc(attrs.hint) : undefined
    )

    const hasError = ref(false)
    const firstError = ref("")

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const radiusStyle = computed(() => ({
      borderRadius: layout.value.square
        ? "0px"
        : layout.value.rounded
          ? "16px"
          : "4px"
    }))

    const inputAttrs = computed(() => {
      const { class: klass, ...rest } = attrs
      return rest
    })

    return {
      attrs,
      layout,
      localValue,
      showPassword,
      isPassword,
      computedType,
      computedMask,
      computedRules,
      translatedLabel,
      translatedPlaceholder,
      translatedHint,
      hasError,
      firstError,
      togglePassword,
      radiusStyle,
      inputAttrs
    }
  }
})
</script>