<template>
  <section class="container">
    <img src="../static/img/logo.png" alt="Nuxt.js Logo" class="logo" />

    </nuxt-link>
  </section>
</template>
<script>
import { mapState } from 'vuex'
export default {
  asyncData ({ req }) {
    return {
      tittle:`测试页面`
    }
  },
  head () {
    return {
      title: `About Page (${this.name}-side)`
    }
  },
  beforeMount(){  //在组件安装之前我们需要做的  先拿到全局对象
    const  wx = window.wx
    const  url = window.location.href
    //触发store里面的状态变更 
    this.$store.dispatch('getUserByOAuth',encodeURIComponent(url))
      .then(res => {
        console.log("res:",res)
        if(res.data.success){
          console.log("parmas",res.data)
          //进行配置权限的验证接入
        }
      })
  }
}
</script>

<style scoped>
.title
{
  margin-top: 50px;
}
.info
{
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
  margin-top: 10px;
}
.button
{
  margin-top: 50px;
}
</style>
