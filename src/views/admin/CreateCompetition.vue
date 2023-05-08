<template>
  <var-card title="创建竞赛">
    <template #extra>
      <div id="info">
        <var-row>
          <var-col span="4">
            <var-input
              placeholder="比赛名称"
              v-model="title"
            />
          </var-col>
          <var-col span="4" offset="2">
            <var-input
              placeholder="开始时间"
              v-model="start_time"
              clearable
              @click="_clickStart"
            />
          </var-col>
          <var-col span="4" offset="2">
            <var-input
              placeholder="结束时间"
              v-model="end_time"
              clearable
              @click="_clickEnd"
            />
          </var-col>
          <var-col span="4" offset="2">
              <var-input
                placeholder="可答题次数"
                type="number"
                v-model="answer_times"
              />
          </var-col>
        </var-row>
        <br>

        <var-radio v-model="is_limit">是否限时</var-radio>
        <div style="width: 200px;">
          <var-input
            v-if="is_limit"
            placeholder="限时时间(分钟)"
            type="number"
            v-model="time_limit"
          />
        </div>


        <div style="margin-top: 30px;line-height: 30px">比赛类型</div>
        <var-radio-group v-model="is_random">
          <var-radio :checked-value="1">各用户题目不同</var-radio>
          <var-radio :checked-value="0">各用户题目相同</var-radio>
        </var-radio-group>

        <div v-if="is_random===0">
          <div style="margin-top: 20px;">题目选取方式</div>
          <var-radio-group v-model="select_type">
            <var-radio :checked-value="0">题库随机抽取</var-radio>
            <var-radio :checked-value="1" @click="search">手动选取</var-radio>
          </var-radio-group>
          <div v-if="select_type===0" style="width: 200px;">
            <var-input
              style="width: 200px"
              placeholder="抽取数量"
              type="number"
              v-model="question_num"
            />
          </div>

          <div v-if="select_type===1">
            <div style="margin: 10px;font-size: 20px;color: #333333">
              已选取{{question_list.length}}道题目
            </div>
            <var-chip v-for="i in question_list" closable size="small" style="margin: 5px" @close="rem(i)">
              ID:{{i}}
            </var-chip>
          </div>
        </div>

        <div v-else>
          <div style="width: 200px;">
            <var-input
              style="width: 200px"
              placeholder="选择题数量"
              type="number"
              v-model="choice_num"
            />
            <var-input
              style="width: 200px"
              placeholder="判断题数量"
              type="number"
              v-model="TF_num"
            />
          </div>
        </div>
      </div>

      <dynamic-table
        v-if="select_type===1&&is_random===0"
        title="选取题目"
        :extend="extend"
        :ready="ready"
        :heads="heads"
        :data="data"
        :total="total"
        @search="search"
        @extra="add">
        <template #extend>
          <div style="padding: 10px 30px">
            <var-button block type="warning">选择</var-button>
          </div>
        </template>
      </dynamic-table>

      <span style="float: right;padding: 0 50px 0 0">
      <var-button type="success" size="large" @click="create_competition">创建竞赛</var-button></span>

      <var-popup v-model:show="popup">
        <div class="popup" v-if="isStart">
          <div>{{isStart? "选择开始时间":"选择结束时间"}}</div>
          <var-date-picker v-model="start_date" v-if="isSelectDate"></var-date-picker>
          <var-time-picker v-model="start_moment" v-else format="24hr"/>
          <var-button block type="primary" v-if="isSelectDate" @click="isSelectDate=false">下一步</var-button>
          <var-button block type="primary" v-else @click="updateTime">确定</var-button>
        </div>
        <div class="popup" v-else>
          <div>{{isStart? "选择开始时间":"选择结束时间"}}</div>
          <var-date-picker v-model="end_date" v-if="isSelectDate"></var-date-picker>
          <var-time-picker v-model="end_moment" v-else format="24hr"/>
          <var-button block type="primary" v-if="isSelectDate" @click="isSelectDate=false">下一步</var-button>
          <var-button block type="primary" v-else @click="updateTime">确定</var-button>
        </div>

      </var-popup>
    </template>
  </var-card>
</template>

<script>
  import DynamicTable from "components/tableView/DynamicTable";

  export default {
    name: "CreateCompetition",
    components: {
      DynamicTable
    },
    data() {
      return {
        title: "",
        start_date: "",
        start_moment: "",
        start_time: "",
        end_date: "",
        end_moment: "",
        end_time: "",
        time_limit: null,
        question_num: null,
        question_list: [],
        is_random: 1,
        is_limit: false,

        select_type: 0,
        ready: false,
        data: null,
        heads: [
          {
            title: "ID",
            refer: "id",
            style: {
              width: "8%",
            },
          },
          {
            title: "题干",
            refer: "content",
            style: {
              width: "20%",
            },
          },
          {
            title: "选项A",
            refer: "choice_a",
            style: {
              width: "8%",
            },
          },
          {
            title: "选项B",
            refer: "choice_b",
            style: {
              width: "8%",
            },
          },
          {
            title: "选项C",
            refer: "choice_c",
            style: {
              width: "8%",
            },
          },
          {
            title: "选项D",
            refer: "choice_d",
            style: {
              width: "8%",
            },
          },
          {
            title: "答案",
            refer: "answer",
            style: {
              width: "8%",
              textAlign: "center"
            },
            tag: "chip",
            tag_style: {
              cursor: "pointer"
            },

          },
          {
            title: "类型",
            refer: "category",
            filter: true,
            style: {
              width: "8%",
              textAlign: "center"
            },
            tag_style: {
              textAlign: "center"
            },
            options: [
              "党史",
              "党史类",
              "改革开放史",
              "社会主义发展史",
              "新中国史",
            ],
          },
          {
            title: "难度",
            refer: "difficulty",
            filter: true,
            style: {
              width: "8%",
              textAlign: "center"
            },
            tag_style: {
              textAlign: "center"
            },
            options: [
              "简单",
              "一般",
              "中等",
              "困难"
            ]
          },
          {
            title: "正确率",
            style: {
              width: "8%",
              textAlign: "center"
            },
            tag_style: {
              textAlign: "center"
            },
            serialize: column => {
              if (column["answer_num"] === 0) return "无数据"
              return parseInt(100 * column["correct_answer_num"] / column["answer_num"]) + "%"
            }
          },
        ],
        extend: {
          title: "",
          style: {
            head: {
              textAlign: "center"
            },
            body: {
              width: "5%"
            }
          }
        },
        total: 0,

        popup: false,
        isSelectDate: true,
        isStart: true,

        TF_num: null,
        choice_num: null,
        answer_times: null
      }
    },
    methods: {
      search(query) {
        this.ready = false
        this.$ajax.api.get(
          "admin/question-bank/?is_active=true&" + query,
        ).then(res => {
          if (res.data.code === 100) {
            this.data = res.data.result['results']
            this.total = res.data.result['count']
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 3000,
            })
          }
          this.ready = true
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 3000,
          })
          this.ready = true
        })
      },
      add(column) {
        if (this.question_list.indexOf(column.id) === -1) {
          this.question_list.push(column.id)
        }
      },
      rem(i) {
        this.question_list = this.question_list.filter(x => x !== i)
      },
      create_competition() {
        if (!this.title || !this.start_time || !this.end_time || !this.answer_times) {
          this.$tip({
            content: "还有信息未填入",
            type: "warning",
            duration: 1000,
          })
          return
        }

        let data = {}
        if (this.select_type === 0 && this.is_random === 0) {
          if (!this.question_num) {
            this.$tip({
              content: "请输入题目数",
              type: "warning",
              duration: 1000,
            })
            return
          }
          data = {
            title: this.title,
            start_time: this.start_time,
            end_time: this.end_time,
            question_num: this.question_num,
            time_limit: this.is_limit ? this.time_limit : null,
            answer_times: this.answer_times || 1
          }
        }

        if (this.select_type === 1 && this.is_random === 0) {
          if (!this.question_list) {
            this.$tip({
              content: "请选择题目",
              type: "warning",
              duration: 1000,
            })
            return
          }
          data = {
            title: this.title,
            start_time: this.start_time,
            end_time: this.end_time,
            question_list: this.question_list,
            time_limit: this.is_limit ? this.time_limit : null,
            answer_times: this.answer_times || 1
          }
        }

        if (this.is_random === 1) {
          if (!this.choice_num || !this.TF_num) {
            this.$tip({
              content: "请选择题目数量",
              type: "warning",
              duration: 1000,
            })
            return
          }
          data = {
            title: this.title,
            start_time: this.start_time,
            end_time: this.end_time,
            choice_num: this.choice_num,
            TF_num: this.TF_num,
            time_limit: this.is_limit ? this.time_limit : null,
            answer_times: this.answer_times || 1
          }
        }


        this.$tip({
          content: "创建中，请稍等",
          type: "success",
          duration: 3000,
        })
        this.$ajax.api.post(
          "admin/competition/",
          data
        ).then(res => {
          if (res.data.code === 100) {
            this.$tip({
              content: "创建竞赛成功",
              type: "success",
              duration: 3000,
            })
            this.$router.push("/admin/competition/" + res.data.result.id)
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 3000,
            })
          }
          this.ready = true
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 3000,
          })
          this.ready = true
        })
      },
      selectTime(TimeType) {
        if (TimeType === 1) {
          this.isStart = true
          this.popup = true
          this.end_time = ''
          this.end_date = ''
          this.end_moment = ''
        } else {
          if (this.start_time === '') {
            this.$tip({
              content: "请先填写开始时间",
              type: "danger",
              duration: 1000,
            })
          } else {
            this.isStart = false
            this.popup = true
          }
        }
      },
      updateTime() {
        this.popup = false
        this.isSelectDate = true
        if (this.start_date !== '' && this.start_moment !== '') {
          this.start_time = this.start_date + " " + this.start_moment
        }
        if (this.end_date !== '' && this.end_moment !== '') {
          this.end_time = this.end_date + " " + this.end_moment
        }
      },
      _clickStart(e) {
        if (e.target.tagName === 'I') {
          return
        }
        this.selectTime(1)
      },
      _clickEnd(e) {
        if (e.target.tagName === 'I') {
          return
        }
        this.selectTime(2)
      }
    }
  }
</script>

<style scoped>
  #info {
    margin: 30px;
  }

  .popup {
    width: 500px;
    border-radius: 30px;
    margin: 30px 50px;
  }
</style>
