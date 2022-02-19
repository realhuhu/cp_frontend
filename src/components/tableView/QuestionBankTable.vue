<template>
  <div style="margin: 100px 20px 0">
    <super-table
      v-if="init"
      title="编辑题库"
      :filters="filters"
      :heads="heads"
      :data="data"
      :total="total"
      @reload="reload"
      @search="to_search"
      @clean="clean"
      @filter="to_filter"
      @patch="update"/>
  </div>
</template>

<script>
  import SuperTable from "./SuperTable";


  export default {
    name: "QuestionBankTable",
    components: {
      SuperTable
    },
    data() {
      return {
        filters: [
          {
            name: "类别",
            refer: "category",
            options: [
              "党史",
              "党史类",
              "改革开放史",
              "社会主义发展史",
              "新中国史",
            ],
            selected: undefined,
          },
          {
            name: "难度",
            refer: "difficulty",
            options: [
              "简单",
              "一般",
              "中等",
              "困难"
            ],
            selected: undefined,
          }
        ],
        heads: [
          {
            title: "ID",
            style: {
              width: "5%",
            },
            refer: column => column["id"]
          },
          {
            title: "题干",
            edit: "content",
            style: {
              width: "30%",
            },
            refer: column => column["content"]
          },
          {
            title: "选项A",
            edit: "choice_a",
            style: {
              width: "9%",
            },
            refer: column => column["choice_a"]
          },
          {
            title: "选项B",
            edit: "choice_b",
            style: {
              width: "9%",
            },
            refer: column => column["choice_b"]
          },
          {
            title: "选项C",
            edit: "choice_c",
            style: {
              width: "9%",
            },
            refer: column => column["choice_c"]
          },
          {
            title: "选项D",
            edit: "choice_d",
            style: {
              width: "9%",
            },
            refer: column => column["choice_d"]
          },
          {
            title: "答案",
            edit: "answer",
            style: {
              width: "7%",
            },
            refer: column => column["answer"],
          },
          {
            title: "类型",
            edit: "category",
            style: {
              width: "7%",
            },
            refer: column => column["category"]
          },
          {
            title: "难度",
            edit: "difficulty",
            style: {
              width: "7%",
            },
            refer: column => column["difficulty"]
          },
          {
            title: "正确率",
            style: {
              width: "8%",
            },
            refer: column => {
              if (column["answer_num"] === 0) {
                return "无数据"
              }
              return parseInt(100 * column["answer_num"] / column["correct_answer_num"]) + "%"
            }
          }
        ],
        total: 0,
        data: null,
        search: "",
        query: [],
        init: false
      }
    },
    methods: {
      reload(page, size) {
        let params = {
          page: page,
          limit: size,
          search: this.search
        }
        for (let i of this.query) {
          if (i.selected) {
            params[i.refer] = i.selected
          }
        }
        this.$ajax.api.get(
          "admin/question-bank/",
          {
            params
          }
        ).then(res => {
          if (res.data.msg !== "错误") {
            this.data = res.data.result['results']
            this.total = res.data.result['count']
          } else {
            this.$tip({
              content: Object.values(res.data.result).map(x => x[0]).join("\n"),
              type: "warning",
              duration: 3000,
            })
          }
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 3000,
          })
        })
      },
      to_search(search) {
        this.search = search
        this.reload(1, 10)
      },
      clean() {
        this.search = ""
        this.reload(1, 10)
      },
      to_filter(query) {
        console.log(query);
        this.query = query
        this.reload(1, 10)
      },
      update(id, key, value) {
        this.$ajax.api.patch(
          `admin/question-bank/${id}/`,
          {
            [key]: value
          }
        ).then(res => {
          if (res.data.msg !== "错误") {
            console.log(res.data);
          } else {
            this.$tip({
              content: Object.values(res.data.result).map(x => x[0]).join("\n"),
              type: "warning",
              duration: 3000,
            })
          }
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 3000,
          })
        })
      }
    },
    beforeCreate() {
      this.$ajax.api.get(
        "admin/question-bank/",
      ).then(res => {
        if (res.data.msg !== "错误") {
          this.data = res.data.result['results']
          this.total = res.data.result['count']
          this.init = true
        } else {
          this.$tip({
            content: Object.values(res.data.result).map(x => x[0]).join("\n"),
            type: "warning",
            duration: 3000,
          })
        }
      }).catch(err => {
        this.$tip({
          content: err,
          type: "error",
          duration: 3000,
        })
      })
    }
  }
</script>

<style scoped>

</style>