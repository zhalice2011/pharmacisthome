<template lang="pug">
  nav#nav(v-if='navVisible')
    nuxt-link(v-for='(item, index) in navList' :to='item.path' :key='index')
      div(v-if='index === 0')
        img(v-if='activeRoute !== item.name' src='~static/images/home.png')
        img(v-else src='~static/images/home-selected.png')
      div(v-else-if='index === 1')
        img(v-if='activeRoute !== item.name' src='~static/images/shopping.png')
        img(v-else src='~static/images/shopping-selected.png')
      div(v-else)
        img(v-if='activeRoute !== item.name' src='~static/images/user.png')
        img(v-else src='~static/images/user-selected.png')
      p {{ item.text }}
</template>

<script>
  export default {
    data () {
      return {
        navList:[ //这就是他的导航
          {
            'path':'/',
            'name':'index',
            'text':'脸谱'
          },
          {
            'path':'/shopping',
            'name':'shopping',
            'text':'手办'
          },
          {
            'path':'/user',
            'name':'user',
            'text':'个人中心'
          }
        ]
      }
    },
    computed: { 
      activeRoute () {//将store里面的值映射过来  获取name
        return this.$route.name
      },
      navVisible () {//导航是否可见 
        // return this.activieRoutt === 'index'
        //   || this.activieRoutt === 'shopping'
        //   || this.activieRoutt === 'user'
        return ['index','shopping','user'].indexOf(this.activeRoute) > -1
      },

    }
  }
</script>

<style scoped lang="sass" src="~/static/sass/nav.sass"></style>
