<template>
  <dynamic-table
    title="编辑用户"
    :ready="ready"
    :extend="extend"
    :heads="heads"
    :data="data"
    :total="total"
    @search="search"
    @update="update"
    @extra="resetPasswordPre">
    <template #extend>
      <div style="padding: 10px 30px">
        <var-button block type="warning">重置密码</var-button>
      </div>
    </template>
  </dynamic-table>

  <var-popup style="border-radius: 20px" v-model:show="popup_reset">
    <div id="popup">
      <div id="title">重置"{{column.username}}"的密码</div>
      <password v-model:password="password"/>
      <password placeholder="确认密码" v-model:password="confirm_password" :confirm="password"/>
      <br>
      <div id="btn">
        <var-button block type="primary" @click="resetPassword">确定</var-button>
      </div>
    </div>
  </var-popup>
</template>

<script>
  import DynamicTable from "./DynamicTable";
  import Password from "../input/Password";

  export default {
    name: "UserTable",
    components: {
      DynamicTable,
      Password
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
            title: "一卡通号",
            refer: "card",
            editable: true,
            style: {
              width: "10%",
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
            serialize: column => column["date_joined"].replace("T", " ").substring(0, 16)
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
        extend: {
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
        total: 0,
        data: null,
        ready: false,
        popup_reset: false,
        column: "",
        re_pattens: this.$settings.re_pattens,
        password: "",
        confirm_password: ""
      }
    },
    methods: {
      search(query) {
        this.ready = false
        this.$ajax.api.get(
          "admin/user/?" + query,
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
      update(id, data) {
        this.$ajax.api.patch(
          `admin/user/${id}/`,
          data
        ).then(res => {
          if (res.data.code === 100) {
            this.$tip({
              content: "已更新",
              type: "success",
              duration: 3000,
            })
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
      resetPasswordPre(column) {
        this.password = ""
        this.confirm_password = ""
        this.popup_reset = true
        this.column = column
      },
      resetPassword() {
        if (!this.re_pattens.password.test(this.password)) return
        if (!this.re_pattens.password.test(this.confirm_password)) return

        if (this.password !== this.confirm_password) return
        this.$ajax.api.patch(
          `admin/user/${this.column.id}/`,
          {
            password: this.password
          }
        ).then(res => {
          if (res.data.code === 100) {
            this.$tip({
              content: "已更新",
              type: "success",
              duration: 3000,
            })
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
        this.popup_reset = false
      }
    },
    beforeCreate() {
      this.$ajax.api.get(
        "admin/user/",
      ).then(res => {
        if (res.data.code === 100) {
          this.data = res.data.result['results']
          this.total = res.data.result['count']
          this.ready = true
        } else {
          this.$tip({
            content: res.data.msg,
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

  #title {
    font-size: 20px;
    text-align: center;
    font-weight: bolder;
  }

  #popup {
    width: 400px;
    padding: 50px;
  }
</style>