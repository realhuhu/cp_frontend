<template>
  <dynamic-table
    title="竞赛列表"
    :ready="ready"
    :heads="heads"
    :extend="extend"
    :data="data"
    :total="total"
    @search="search"
    @update="update"
    @extra="detail">
    <template #extend>
      <div style="padding:10px 20px">
        <var-button block type="success">查看详情</var-button>
      </div>
    </template>
  </dynamic-table>
</template>

<script>
  import DynamicTable from "./DynamicTable";

  export default {
    name: "CompetitionLitTable",
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
              width: "5%",
            },
          },
          {
            title: "竞赛名称",
            refer: "title",
            editable: true,
            style: {
              width: "15%",
            },
          },
          {
            title: "开始时间",
            refer: "start_time",
            editable: true,
            style: {
              width: "15%",
            },
            serialize: column => column["start_time"].replace("T", " "),
            deserialize: raw => raw.replace(" ", "T")
          },
          {
            title: "结束时间",
            refer: "end_time",
            editable: true,
            style: {
              width: "15%",
            },
            serialize: column => column["start_time"].replace("T", " "),
            deserialize: raw => raw.replace(" ", "T")
          },
          {
            title: "答题限时(分钟)",
            refer: "time_limit",
            editable: true,
            style: {
              width: "10%",
            },
            serialize: column => column["time_limit"]
          },
          {
            title: "参与人数",
            refer: "answer_num",
            style: {
              width: "10%",
            }
          },
          {
            title: "问题数量",
            refer: "questions",
            style: {
              width: "10%",
            },
            serialize: column => column["questions"].length
          },
          {
            title: "状态",
            refer: "is_active",
            editable: true,
            filter: true,
            edit_type: "select",
            style: {
              width: "10%",
            },
            serialize: column => column["is_active"] ? "正常" : "屏蔽",
            deserialize: raw => raw === "正常",
            options: [
              "正常",
              "屏蔽",
            ]
          }
        ],
        extend: {
          title: "操作",
          style: {
            head: {
              textAlign: "center"
            },
            body: {
              width: "10%"
            }
          }
        },
        total: 0,
        data: null,
        ready: false,
      }
    },
    methods: {
      search(query) {
        this.ready = false
        this.$ajax.api.get(
          "admin/competition/?" + query,
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
          `admin/competition/${id}/`,
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
      detail(column) {
        this.$router.replace(`/admin/competition/${column.id}`)
      }
    },
    beforeCreate() {
      this.$ajax.api.get(
        "admin/competition/",
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