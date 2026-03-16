
import { boot } from 'quasar/wrappers'
import TBtn from './../components/engine/BtnComponent.vue'
import TCard from './../components/engine/CardComponent.vue'
import TInput from './../components/engine/InputComponent.vue'
import TSelect from './../components/engine/SelectComponent.vue'
import TDrawer from './../components/engine/DrawerComponent.vue'
import TField from './../components/engine/FieldComponent.vue'

import TUpload from "./../components/engine/UploadComponent.vue"
import TCheckbox from "./../components/engine/CheckBoxComponent.vue"
import TSwitch from "./../components/engine/SwitchComponent.vue"

export default boot(({ app }) => {

  app.component('s-btn', TBtn)
  app.component('s-card', TCard)
  app.component('s-input', TInput)
  app.component('s-drawer', TDrawer)
  app.component('s-select', TSelect)
  app.component('s-field', TField)
  app.component('s-switch', TSwitch)
  app.component('s-checkbox', TCheckbox)
  app.component('s-upload', TUpload)

})