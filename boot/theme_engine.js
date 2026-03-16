
import { boot } from 'quasar/wrappers'
import TBtn from './../components/engine/BtnComponent.vue'
import TCard from './../components/engine/CardComponent.vue'
import TInput from './../components/engine/InputComponent.vue'
import TDrawer from './../components/engine/DrawerComponent.vue'

export default boot(({ app }) => {

  app.component('s-btn', TBtn)
  app.component('s-card', TCard)
  app.component('s-input', TInput)
  app.component('s-drawer', TDrawer)

})