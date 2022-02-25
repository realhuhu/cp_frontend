<template>
  <dynamic-table
    title="竞赛成绩"
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
    name: "ScoreTable",
    components: {
      DynamicTable
    },
    data() {
      return {
        ready: false,
        data: null,
        total: null,
        heads: [
          {
            title: "ID",
            refer: "id",
            style: {
              width: "5%",
            },
          },
          {
            title: "用户名",
            refer: "username",
            style: {
              width: "15%",
            },
          },
          {
            title: "竞赛名称",
            refer: "competition",
            style: {
              width: "15%",
            },
          },
          {
            title: "答题时间",
            refer: "start_time",
            style: {
              width: "15%",
            },
            serialize: column => column["start_time"].substring(0, 16).replace("T", " "),
          },
          {
            title: "限时(秒)",
            refer: "time_limit",
            style: {
              width: "10%",
              textAlign: "center"
            },
            serialize: column => column["time_limit"] * 60,
            tag_style: {
              textAlign: "center"
            },
          },
          {
            title: "用时(秒)",
            refer: "time_used",
            style: {
              width: "10%",
              textAlign: "center"
            },
            tag_style: {
              textAlign: "center"
            },
          },
          {
            title: "得分",
            refer: "score",
            style: {
              width: "10%",
              textAlign: "center"
            },
            tag_style: {
              textAlign: "center"
            },
          },
          {
            title: "是否有效",
            refer: "is_active",
            editable: true,
            filter: true,
            edit_type: "select",
            style: {
              width: "10%",
              textAlign: "center"
            },
            serialize: column => column["is_active"] ? "是" : "否",
            deserialize: raw => raw === "是",
            options: [
              "是",
              "否",
            ],
            tag_style: {
              textAlign: "center"
            },
          }
        ],

      }
    },
    methods: {
      search(query) {
        this.ready = false
        this.$ajax.api.get(
          "admin/score/?" + query,
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
          `admin/score/${id}/`,
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
      },
    },
    beforeCreate() {
      this.$ajax.api.get(
        "admin/score/",
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