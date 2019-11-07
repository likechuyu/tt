import myCrumbs from '@/components/my-crumbs.vue'
import myChannel from '@/components/my-channel.vue'
import myImg from '@/components/my-img.vue'

export default {
  install (Vue) {
    Vue.component(myCrumbs.name, myCrumbs)
    Vue.component(myChannel.name, myChannel)
    Vue.component(myImg.name, myImg)
  }
}
