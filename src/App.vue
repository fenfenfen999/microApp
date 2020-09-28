<template>
  <div id="app" class="app" :key="routeParams">
    <main-header v-if="!showPageOnly"></main-header>
    <router-view/>
  </div>
</template>

<script>
import http from '@/utils/http.js'
import url from '@/utils/url.js'
import mainHeader from '@/components/common/header.vue'
import mainFooter from '@/components/common/footer.vue'
import shortcut from '@/components/common/shortcut.vue'
// import { getTodayStart } from '@/utils/dateTime.js'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      content: '',
      noticeState: false
    }
  },
  components: {
    mainHeader,
    mainFooter,
    shortcut
  },
  computed: {
    ...mapGetters([
      'showPageOnly',
      'loginUserName'
    ])
  },
  // watch: {
  //   loginUserName (nv, ov) {
  //     if (nv && nv !== '' && this.$cookies.get(nv + '-notice') === null) {
  //       this.noticeState = true
  //       let time = Math.floor((1000 * 60 * 60 * 24 + getTodayStart() - new Date().getTime()) / 1000)
  //       this.$cookies.set(this.loginUserName + '-notice', 1, time)
  //     }
  //   }
  // },
  created () {
  }
}
</script>

<style>
@import "assets/reset.css";
</style>
