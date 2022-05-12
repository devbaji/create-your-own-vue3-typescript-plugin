import { App } from 'vue'
import BlueInput from './BlueInput.vue'

export default {
  install(app: App) {
    app.component('BlueInput', BlueInput)
  }
}