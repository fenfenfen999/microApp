<template>
  <a-spin :spinning="loading">
    <div class="micro-app" ref="container">
    </div>
  </a-spin>
</template>

<script>
  import { loadMicroApp } from 'qiankun'
  import { removeHash } from '@/utils/util'
  export default {
    name: 'MicroApp',
    props: {
      name: {
        type: String,
        required: true
      },
      entry: {
        type: String,
        required: true
      },
      subRoute: {
        type: String,
        default: () => ''
      },
      option: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        microApp: null,
        loading: false
      }
    },
    watch: {
      'subRoute': function (newVal, oldVal) {
        if (newVal !== oldVal) {
          if (this.microApp &&
            this.microApp.getStatus() === 'MOUNTED') {
            this.microApp.unmount().then(() => {
              this.mountMicroApp()
            })
          } else {
            this.mountMicroApp()
          }
        }
      }
    },
    methods: {
      mountMicroApp () {
        this.loading = true
        this.microApp = loadMicroApp({
          name: this.name,
          entry: this.entry,
          container: this.$refs.container,
          props: Object.assign({
            mainRouter: this.$router, // 传入主路由，以便跳转回主系统
            subRoute: this.subRoute,
            singular: false,
            sandbox: true
          }, this.option)
        })
        this.microApp.mountPromise.then(() => {
          this.loading = false
        }).catch((err) => {
          console.log(err)
          this.loading = false
        })
      },
      async unmountMicroApp () {
        if (!this.microApp || this.microApp.getStatus() !== 'MOUNTED') {
          removeHash()
          return
        }
        await this.microApp.unmount().then(() => {
          // fix: 清理hash，否则上一个打开的子系统hash路由会拼接到下一个打开的子系统hash路由上
          removeHash()
        }).catch(err => console.log(err))
      }
    },
    mounted () {
      this.mountMicroApp()
    },
    beforeDestroy () {
      this.unmountMicroApp()
    }
  }
</script>

<style scoped>
  .micro-app {
    width: 100%;
    height: 100%;
    min-height: 661px;
    overflow: auto;
  }
</style>
