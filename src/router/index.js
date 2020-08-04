import Vue from 'vue'
import Router from 'vue-router'
import clockIn from '@/views/clockIn'
import dailyAtten from '@/views/dailyAttendance'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'clockIn',
      component: clockIn
    },
    {
      path: '/dailyAtten',
      name: 'dailyAtten',
      component: dailyAtten
    }
  ]
})
