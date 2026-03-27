import { createSSRApp } from 'vue'
import uViewPro from 'uview-pro'
import * as Pinia from 'pinia'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(uViewPro)
  app.use(Pinia.createPinia())
  return {
    app,
    Pinia,
  }
}
