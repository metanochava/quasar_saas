<template>

  <q-btn
    v-bind="btnAttrs"

    :label="translatedLabel"

    :dense="attrs.dense ?? layout.button_dense"
    :round="attrs.round ?? layout.button_round"

    :flat="attrs.flat ?? layout.button_style === 'flat'"
    :outline="attrs.outline ?? layout.button_style === 'outline'"
    :unelevated="attrs.unelevated ?? layout.button_style === 'unelevated'"
    :push="attrs.push ?? layout.button_style === 'push'"

    :loading="attrs.loading"

    :ripple="animation.button_animation === 'ripple'"

    :class="[
      attrs.class,
      animation.hover_effect ? 'hover-' + animation.hover_style : '',
      animation.button_animation === 'pulse' ? 'btn-anim-pulse' : ''
    ]"

    :style="{
      borderRadius: layout.square
        ? '0px'
        : layout.rounded
        ? '16px'
        : '4px'
    }"

  >

    <slot/>

  </q-btn>

</template>

<script>

import { defineComponent, computed, useAttrs } from "vue"
import { UserStore } from "./../../stores/AuthStore"
import { tdc } from "../../boot/base"

export default defineComponent({

  name:"s-btn",
  inheritAttrs:false,

  setup(){

    const attrs = useAttrs()
    const User = UserStore()

    const layout = computed(()=>User.ps?.layout || {})
    const animation = computed(()=>User.ps?.animation || {})

    const translatedLabel = computed(()=>{
      return attrs.label ? tdc(attrs.label) : undefined
    })

    const btnAttrs = computed(()=>{

      const {
        label,
        ...rest
      } = attrs

      return rest

    })

    return{
      attrs,
      layout,
      animation,
      translatedLabel,
      btnAttrs
    }

  }

})
   
</script>