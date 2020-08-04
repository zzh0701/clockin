<template>
  <div>
    <div class="app-color">
      <div class="content-box">
        <!--  月份  -->
        <div class="layout-side">
          <div class="flex-center left-right-btn" @click="prevMonth">&lt;</div>
          <div class="layout-center-top">
            <div class="flex-center time-title">
              <span>{{monthList[indexMon%12]}}</span>
              <span>{{monthList[(indexMon+1)%12]}}</span>
              <span class="time-title-active">{{monthList[(indexMon+2)%12]}}</span>
              <span>{{monthList[(indexMon+3)%12]}}</span>
              <span>{{monthList[(indexMon+4)%12]}}</span>
            </div>
          </div>
          <div class="flex-center left-right-btn" @click="nextMonth">&gt;</div>
        </div>
        <!--    日期表-->
        <div class="width-100-per layout-left-top height-85-per">
          <!--      星期-->
          <div class="width-100-per layout-left-top height-10-per">
            <div class="flex-center width-daily" v-for="(i,index) in weekArr" :key="index + i">{{i}}
            </div>
          </div>
          <!--      日期-->
          <div class="width-100-per layout-left-top background-mine" style="height: 90%">
            <template v-for="(item,index) in dateArr">
              <div class="flex-center table-col" :style="{height: 'calc(100% / '+maxTableRow+')'}" :key="index" >
                <div :title="item.currDate" class="width-100-per flex-center checked" :class="item.checked" style="cursor: default;position: relative">
                  <span @click="rentCheck(item.currDate)">{{item === '' ? '' : Number(item.currDate.split('-')[2])}}</span>
                  <div v-if="today(item.currDate)" class="check-badge"></div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="footer-box">
        <div class="box">
          <div class="top tag tag-green"></div>
          <span class="box-bottom">已打卡</span>
        </div>
        <div class="box">
          <div class="top tag tag-blue"></div>
          <span class="box-bottom">未打卡</span>
        </div>
        <div class="box">
          <div class="top tag tag-red"></div>
          <span class="box-bottom">缺卡</span>
        </div>
        <div class="box" style="margin-top: 9%;">
          <div class="top badge"></div>
          <span class="box-bottom">当前日期</span>
        </div>
      </div>
      <div class="footer-detail">
        <div class="footer-detail-left">
          <div class="detail-box">
            <div class="detail-top"></div>
            <div class="detail">
              <span>08:50:00</span>
            </div>
          </div>
          <div class="detail-center"></div>
          <div class="detail-box">
            <div class="detail-bottom"></div>
            <div class="detail">
              <span>18:00:00</span>
            </div>
          </div>
        </div>
        <div class="footer-detail-right">
          <div class="right-detail">
            <span>备注：<br>&nbsp;&nbsp;&nbsp;日历打卡<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;今日工作：<br>&nbsp;&nbsp;&nbsp;日历打卡</span>
          </div>
        </div>
      </div>
    </div>
    <div class="daily-atten" v-show="showDaily">
      <div class="close" @click="closeModal">
        <img :src="imageUrl" />
      </div>
      <daily-attendance></daily-attendance>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  import dailyAttendance from './dailyAttendance';
  export default {
    components: {
      dailyAttendance
    },
    data() {
      return {
        showDaily: false,
        imageUrl: "../../static/img/close.png",
        startTime: moment('2020-08-16').format('YYYY-MM-DD'),
        endTime: moment('2020-08-30').format('YYYY-MM-DD'),
        thisDate: moment('2020-08-18').format('YYYY-MM-DD'),//当前时间
        thisMonthDays: '',//当月天数
        thisDateWeek: '',//当月第一天是星期几
        newDate: '',//标题展示时间
        dateArr: [],//日期数组，有则填日期，无则填''
        weekArr: ['日','一', '二', '三', '四', '五', '六'],
        checkArr: [
          {'date': '2020-08-20'},
          {'date': '2020-08-25'},
        ],//已打过卡
        maxTableRow: 0,//列固定7列，这是当月最大行数,
        indexMon: 0,
        monthList:[
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sept',
          'Oct',
          'Nov',
          'Dec',
        ]
      }
    },
    computed: {},
    methods: {
      today(curr) {
        if (curr == moment('2020-08-18').format('YYYY-MM-DD')) {
          return true;
        }
        return false;
      },
      getMonth() {
        let date = new Date(this.thisDate);
        return date.toDateString().split(" ")[1];
      },
      rentCheck(curr) {
        if (moment(curr).isBefore(this.startTime) || moment(curr).isAfter(this.endTime)) {
          return;
        }
        if (moment(curr).isAfter(moment('2020-08-18').format('YYYY-MM-DD'))) {
          return;
        }
        let obj = this.checkArr.find( item => {
          return item.date == curr
        })
        let items = {
          date: curr
        };
        this.showDaily = true;
      },
      closeModal() {
        this.showDaily = false;
      },
      checkCurr(curr) {
        let obj;
        if (moment(curr).isSame(moment(this.startTime).format('YYYY-MM-DD'))) {
          obj = {
            currDate : curr,
            checked: 'checked-blue checked-radius-left'
          }
        } else if(moment(curr).isSame(moment(this.endTime).format('YYYY-MM-DD'))) {
          obj = {
            currDate : curr,
            checked: 'checked-blue checked-radius-right'
          }
        } else {
          obj = {
            currDate : curr,
            checked: 'checked-blue'
          }
        }
        return obj;
      },
      //绘制日历表格
      calendarTable(date) {
        const _this = this;
        _this.dateArr = [];
        _this.newDate = date;
        // 当月的第一天
        let curr = _this.newDate.substring(0,8) + '01';
        //当月天数
        _this.thisMonthDays = moment(date).daysInMonth();
        //当月一号是星期几
        _this.thisDateWeek = moment(date).date(1).weekday();
        let calendarArr = [];
        //往日历数组装每天的日期
        let flag = false;
        //已打卡数组下标
        let index = 0;
        let checkLen = this.checkArr.length;
        for (let i = 1; i < _this.thisMonthDays + 1; i++) {
          let obj = {};
          if (moment(curr).isSameOrAfter(moment(_this.startTime).format('YYYY-MM-DD')) &&
              moment(curr).isSameOrBefore(moment(_this.endTime).format('YYYY-MM-DD'))) {
            flag = true;
          } else {
            flag = false;
          }
          if (flag) {
            if (checkLen != 0) {
              if (curr == _this.checkArr[index].date) {
                obj = {
                  currDate : curr,
                  checked: 'checked-green'
                }
                if (index < checkLen-1) {
                  index ++;
                }
              } else {
                if (moment(curr).isBefore(moment('2020-08-18').format('YYYY-MM-DD'))) {
                  obj = {
                    currDate : curr,
                    checked: 'checked-red'
                  }
                } else {
                  obj = this.checkCurr(curr);
                }
              }
            } else {
              if (moment(curr).isBefore(moment('2020-08-18').format('YYYY-MM-DD'))) {
                obj = {
                  currDate : curr,
                  checked: 'checked-red'
                }
              } else {
                obj = this.checkCurr(curr);
              }
            }
          } else {
            obj = {
              currDate : curr,
              checked: ''
            }
          }
          calendarArr.push(obj);
          // 日期向后移一天
          curr = moment(curr).add(1, 'days').format('YYYY-MM-DD');
        }
        // 有当月一号是星期几根据规则往前面补空位
        for (let j = 0; j < _this.thisDateWeek; j++) {
          calendarArr.unshift('')
        }
        // 表格列数固定为7列，获取最大行数
        let len = calendarArr.length;
        let arrRow = Math.ceil(len / 7);
        _this.maxTableRow = arrRow;
        // 获取整个表格的格子个数，给多余的格子补空
        for (let k = 0; k < arrRow * 7 - len; k++) {
          calendarArr.push('')
        }
        _this.dateArr = calendarArr;
      },
      //上个月
      prevMonth() {
        const _this = this;
        let date = moment(_this.newDate).subtract(1, 'months').format('YYYY-MM-DD');
        _this.indexMon = moment(date).get('month');
        _this.calendarTable(date)
      },
      // 下个月
      nextMonth() {
        const _this = this;
        let date = moment(_this.newDate).add(1, 'months').format('YYYY-MM-DD');
        _this.indexMon = moment(date).get('month');
        _this.calendarTable(date)
      }
    },
    created() {
      this.indexMon = moment('2020-08-18').get('month');
    },
    mounted() {
      this.calendarTable(this.thisDate);
    }
  }
</script>
<style lang="scss" scoped>
@import "~@/mixin.scss";
  .app-color {
    height: 100%;
    position: fixed;
    background-image: url('../../static/img/bg.jpg');
  }
  .content-box {
    height: px2rem(800);
    width: 100%;
    background-image: url('../../static/img/bg.jpg');
  }
  .width-100-per {
    width: 100%;
  }
  .height-85-per {
    height: calc(100% - 15%);
  }
  .height-10-per {
    height: 10%;
  }
  .width-daily {
    width: calc(100% / 7);
  }
  .time-title {
    margin-top: px2rem(1);
    width: 100%;
    height: 100%;
    color: rgb(88, 86, 86);
    span {
      font-weight: bold;
      padding: px2rem(20);
    }
  }
  .time-title-active {
    color: black;
  }

  .table-col {
    width: calc(100% / 7);
  }

  .left-right-btn {
    width: 10%;
    height: 100%;
  }
  .checked {
    height: 100%;
    color: #ffffff;
    cursor: pointer !important;
  }
  .checked-green {
    background: rgba(139,222,146,0.8);
  }
  .checked-red {
    background: rgba(242,149,149,0.7);
  }
  .checked-blue {
    background: rgba(107,208,215,0.5);
  }
  .checked-radius-left {
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
  }
  .checked-radius-right {
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
  }
  .check-badge {
    width: px2rem(50);
    height: px2rem(10);
    border-radius: 20%;
    bottom: px2rem(10);
    position: absolute;
    background: -webkit-gradient(linear, 0 100%, 100% 100%, from(#52c41a), to(#ffffff));
  }

    /*布局部分*/
  .layout-side {
    height: 10%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: px2rem(20);
  }

  .flex-center {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    justify-content: center;
    align-items: center;
  }

  .layout-center-top {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    justify-content: flex-start;
    align-items: center;
  }

  .layout-left-top {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    justify-content: flex-start;
    align-items: flex-start;
  }
  .background-mine {
    background-image: url('../../static/img/bg.jpg');
    background-size: 100% 100%;
  }

  .footer-box {
    margin: px2rem(20) 0 px2rem(20) 0;
    padding: px2rem(10);
    background-image: url('../../static/img/bg.jpg');
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-around;
    .box {
      .top {
        width: 80%;
      }
      .tag {
        flex-basis: auto;
        width: px2rem(50);
        height: px2rem(50);
        line-height: px2rem(15);
        text-align: center;
        border-radius: 50%;
      }
      .badge {
        align-self: flex-end;
        width: px2rem(50);
        height: px2rem(10);
        border-radius: 20%;
        background: -webkit-gradient(linear, 0 100%, 100% 100%, from(#52c41a), to(#ffffff));
      }
      .box-bottom {
        padding: px2rem(5);
        font-size: px2rem(15);
      }
    }
    .tag-white {
      border: px2rem(20) solid #ffffff;
    }
    .tag-green {
      border: px2rem(20) solid #8bde92;
    }
    .tag-red {
      border: px2rem(20) solid #f29595;
    }
    .tag-blue {
      border: px2rem(20) solid #6bd0d7;
    }
  }
  .footer-detail {
    height: px2rem(200);
    padding: px2rem(20) px2rem(20) px2rem(20) px2rem(40);
    background-image: url('../../static/img/bg.jpg');
    display: flex;
    .footer-detail-left {
      width: 30%;
    }
    .footer-detail-right {
      width: 65%;
    }
    .detail-box {
      .detail-top {
        width: px2rem(50);
        height: px2rem(50);
        border-radius: 50%;
        display:inline-block;
        background: -webkit-gradient(linear, 0 0, 0 100%, from(#ee9ca7), to(#ffdde1));
      }
      .detail {
        display:inline-block;
        height: px2rem(50);
        span {
          background-image: -webkit-linear-gradient(bottom, #ee9ca7, #ffdde1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: px2rem(10);
        }
      }
      .detail-bottom {
        width: px2rem(50);
        height: px2rem(50);
        border-radius: 50%;
        display:inline-block;
        background: -webkit-gradient(linear, 0 0, 0 100%, from(#ee9ca7), to(#ffdde1));
      }
    }
    .detail-center {
      background:linear-gradient(to right,#ffdde1,#ee9ca7 px2rem(5),transparent px2rem(5), transparent);
      background-size: px2rem(20) 100%;
      width: px2rem(15);
      height: px2rem(80);
      margin-left: px2rem(65);
    }
    .right-detail {
      height: px2rem(170);
      span {
        background-image: -webkit-linear-gradient(bottom, #ee9ca7, #ffdde1);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: px2rem(15);
        font-weight: bold;
      }
    }
  }
  .daily-atten {
    width: px2rem(800);
    height: px2rem(900);
    z-index: 9999;
    position: fixed;
    background-image: -webkit-linear-gradient(bottom, #ddd6f3, #faaca8);
    padding: px2rem(20);
    margin: 4rem 1rem 1rem 1rem;
    .close {
      float: right;
      img {
        width: px2rem(50);
        height: px2rem(50);
      }
    }
  }
</style>