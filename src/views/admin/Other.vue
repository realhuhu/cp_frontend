<template>
  <dynamic-table
    title="轮播图链接"
    :ready="swipe_ready"
    :heads="swipe_heads"
    :data="swipe_data"
    :total="swipe_total"
    @search="swipe_search"
    @update="swipe_update">
  </dynamic-table>
  <br>
  <dynamic-table
    title="置顶链接"
    :ready="top_ready"
    :heads="top_heads"
    :data="top_data"
    :total="top_total"
    :extend="top_extend"
    @update="top_update"
    @search="top_search"
    @extra="rem">
    <template #extend>
      <div style="padding: 10px 30px">
        <var-button block type="danger">删除</var-button>
      </div>
    </template>
  </dynamic-table>
  <var-button type="primary" @click="pop=true" style="float: right;margin: 20px">添加置顶</var-button>

  <var-popup v-model:show="pop" style="    border-radius: 20px;">
    <div class="pop">
      <div style="text-align: center">添加置顶</div>
      <div class="btn">
        <var-input placeholder="标题" v-model="title"/>
      </div>
      <div class="btn">
        <var-input placeholder="链接" v-model="url"/>
      </div>
      <div style="padding: 30px">
        <var-button type="primary" @click="submit" block>确定</var-button>
      </div>
    </div>
  </var-popup>

</template>

<script>
  import DynamicTable from "components/tableView/DynamicTable";

  export default {
    name: "Other",
    components: {
      DynamicTable
    },
    data() {
      return {
        swipe_ready: false,
        swipe_heads: [
          {
            title: "ID",
            refer: "id",
            style: {
              width: "5%",
            },
          },
          {
            title: "链接",
            refer: "url",
            editable: true,
            style: {
              textAlign: "center"
            },
            tag_style: {
              textAlign: "center"
            },
          }],
        swipe_data: false,
        swipe_total: false,

        top_ready: false,
        top_heads: [
          {
            title: "ID",
            refer: "id",
            style: {
              width: "5%",
            },
          },
          {
            title: "标题",
            refer: "title",
            editable: true,
            style: {
              width: "15%",
            },
          },
          {
            title: "链接",
            refer: "url",
            editable: true,
            style: {
              textAlign: "center"
            },
            tag_style: {
              textAlign: "center"
            },
          }],
        top_data: false,
        top_total: false,
        top_extend: {
          title: "操作",
          style: {
            head: {
              textAlign: "center"
            },
            body: {
              width: "5%"
            }
          }
        },

        pop: false,
        title: "",
        url: "",
      }
    },
    methods: {
      swipe_update(id, data) {
        this.$ajax.api.patch(
          `admin/swipe/${id}/`,
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
      swipe_search(query) {
        this.swipe_ready = false
        this.$ajax.api.get(
          "admin/swipe/?" + query,
        ).then(res => {
          if (res.data.msg !== "错误") {
            this.swipe_data = res.data.result['results']
            this.swipe_total = res.data.result['count']
          } else {
            this.$tip({
              content: res.data.result,
              type: "warning",
              duration: 3000,
            })
          }
          this.swipe_ready = true
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 3000,
          })
          this.swipe_ready = true
        })
      },

      top_update(id, data) {
        this.$ajax.api.patch(
          `admin/top/${id}/`,
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
      top_search(query) {
        this.top_ready = false
        this.$ajax.api.get(
          "admin/top/?" + query,
        ).then(res => {
          if (res.data.msg !== "错误") {
            this.top_data = res.data.result['results']
            this.top_total = res.data.result['count']
          } else {
            this.$tip({
              content: res.data.result,
              type: "warning",
              duration: 3000,
            })
          }
          this.top_ready = true
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 3000,
          })
          this.top_ready = true
        })
      },

      rem(column) {
        this.$ajax.api.delete(
          `admin/top/${column.id}/`,
        ).then(res => {
          if (res.data.msg !== "错误") {
            this.$tip({
              content: "已删除",
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
          this.top_search()
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
      submit() {
        this.$ajax.api.post(
          "admin/top/",
          {
            title: this.title,
            url: this.url,
          }
        ).then(res => {
          if (res.data.msg !== "错误") {
            this.title = ""
            this.url = ""
            this.top_search()
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
          this.top_ready = true
        })
      }
    },
    beforeCreate() {
      this.$ajax.api.get(
        "admin/swipe/",
      ).then(res => {
        if (res.data.msg !== "错误") {
          this.swipe_data = res.data.result['results']
          this.swipe_total = res.data.result['count']
          this.swipe_ready = true
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
      this.$ajax.api.get(
        "admin/top/",
      ).then(res => {
        if (res.data.msg !== "错误") {
          this.top_data = res.data.result['results']
          this.top_total = res.data.result['count']
          this.top_ready = true
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
  .pop {
    width: 500px;
    padding: 30px;
  }

  .btn {
    margin: 20px;
  }
</style>