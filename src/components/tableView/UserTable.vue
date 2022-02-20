<template>
  <div style="margin: 100px 20px 0">
    <dynamic-table
      title="编辑用户"
      :ready="ready"
      :heads="heads"
      :data="data"
      :total="total"
      @search="search"
      @update="update"/>
  </div>
</template>

<script>
  import DynamicTable from "./DynamicTable";


  export default {
    name: "UserTable",
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
            title: "用户名",
            refer: "username",
            editable: true,
            style: {
              width: "10%",
            },
          },
          {
            title: "头像",
            refer: "icon",
            editable: true,
            style: {
              width: "10%",
            },
          },
          {
            title: "电话号码",
            refer: "phone",
            editable: true,
            style: {
              width: "10%",
            },
          },
          {
            title: "注册时间",
            refer: "date_joined",
            style: {
              width: "20%",
            },
            serialize: column => column["date_joined"].substring(0, 19).replace("T", " ")
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
          },
          {
            title: "管理员",
            refer: "is_superuser",
            editable: true,
            filter: true,
            edit_type: "select",
            style: {
              width: "10%",
              textAlign: "center"
            },
            tag: "chip",
            tag_style: {
              cursor: "pointer",
              margin: "0 30%",
              backgroundColor: "#4ebaee",
              fontWeight: "bold",
              color: "white"
            },
            serialize: column => column["is_superuser"] ? "是" : "否",
            deserialize: raw => raw === "是",
            options: [
              "是",
              "否",
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
          "admin/user/?" + query,
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
          `admin/user/${id}/`,
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
        "admin/user/",
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