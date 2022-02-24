<template>
  <dynamic-table
    title="编辑题库"
    :ready="ready"
    :heads="heads"
    :data="data"
    :total="total"
    @search="search"
    @update="update"/>
</template>

<script>
  import DynamicTable from "./DynamicTable";


  export default {
    name: "QuestionBankTable",
    components: {
      DynamicTable
    },
    data() {
      return {
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
            editable: true,
            style: {
              width: "20%",
            },
          },
          {
            title: "选项A",
            refer: "choice_a",
            editable: true,
            style: {
              width: "8%",
            },
          },
          {
            title: "选项B",
            refer: "choice_b",
            editable: true,
            style: {
              width: "8%",
            },
          },
          {
            title: "选项C",
            refer: "choice_c",
            editable: true,
            style: {
              width: "8%",
            },
          },
          {
            title: "选项D",
            refer: "choice_d",
            editable: true,
            style: {
              width: "8%",
            },
          },
          {
            title: "答案",
            refer: "answer",
            editable: true,
            edit_type: "select",
            style: {
              width: "8%",
              textAlign: "center"
            },
            tag: "chip",
            tag_style: {
              cursor: "pointer"
            },
            options: [
              "A",
              "B",
              "C",
              "D"
            ]
          },
          {
            title: "类型",
            refer: "category",
            editable: true,
            filter: true,
            edit_type: "select",
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
            editable: true,
            filter: true,
            edit_type: "select",
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
          {
            title: "状态",
            refer: "is_active",
            editable: true,
            filter: true,
            edit_type: "select",
            style: {
              width: "8%",
              textAlign: "center"
            },
            tag_style: {
              textAlign: "center"
            },
            serialize: column => {
              if (column["is_active"]) return "有效"
              return "屏蔽"
            },
            deserialize(raw) {
              return raw === "有效";

            },
            options: [
              "有效",
              "屏蔽"
            ]
          },
        ],

        total: 0,
        data: null,
        ready: false
      }
    },
    methods: {
      search(query) {
        this.ready = false
        this.$ajax.api.get(
          "admin/question-bank/?" + query,
        ).then(res => {
          if (res.data.msg !== "错误") {
            this.data = res.data.result['results']
            this.total = res.data.result['count']
          } else {
            this.$tip({
              content: res.data.result,
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
      update(id, data) {
        this.$ajax.api.patch(
          `admin/question-bank/${id}/`,
          data
        ).then(res => {
          if (res.data.msg !== "错误") {
            this.$tip({
              content: "已更新",
              type: "success",
              duration: 3000,
            })
          } else {
            this.$tip({
              content: res.data.result,
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
      }
    },
    beforeCreate() {
      this.$ajax.api.get(
        "admin/question-bank/",
      ).then(res => {
        if (res.data.msg !== "错误") {
          this.data = res.data.result['results']
          this.total = res.data.result['count']
          this.ready = true
        } else {
          this.$tip({
            content: res.data.result,
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