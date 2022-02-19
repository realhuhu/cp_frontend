<template>
  <div style="margin: 100px 20px 0">
    <super-table
      title="用户信息"
      v-if="init"
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
    name: "UserTable",
    components: {
      SuperTable
    },
    data() {
      return {
        heads: [
          {
            title: "ID",
            style: {
              width: "5%",
            },
            refer: column => column["id"]
          },
          {
            title: "用户名",
            edit: "username",
            style: {
              width: "10%",
            },
            refer: column => column["username"]
          },
          {
            title: "头像",
            edit: "icon",
            style: {
              width: "10%",
            },
            refer: column => column["icon"]
          },
          {
            title: "电话号码",
            edit: "phone",
            style: {
              width: "10%",
            },
            refer: column => column["phone"]
          },
          {
            title: "注册时间",
            edit: "date_joined",
            style: {
              width: "20%",
            },
            refer: column => column["date_joined"].substring(0, 19).replace("T", " ")
          },
          {
            title: "是否被封号",
            edit: "is_active",
            style: {
              width: "10%",
            },
            refer: column => column["is_active"] ? "否" : "是"
          },
          {
            title: "是否为管理员",
            edit: "is_superuser",
            style: {
              width: "10%",
            },
            refer: column => column["is_superuser"] ? "是" : "否"
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
          "admin/user/",
          {
            params
          }
        ).then(res => {
          if (res.data.msg !== "错误") {
            this.data = res.data.result['results']
            this.total = res.data.result['count']
          } else {
            this.$tip({
              content: Object.values(res.data.result).map(x=>x[0]).join("\n"),
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
          `admin/user/${id}/`,
          {
            [key]: value
          }
        ).then(res => {
          if (res.data.msg !== "错误") {
            console.log(res.data);
          } else {
            this.$tip({
              content:Object.values(res.data.result).map(x=>x[0]).join("\n"),
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
        "admin/user/",
      ).then(res => {
        if (res.data.msg !== "错误") {
          this.data = res.data.result['results']
          this.total = res.data.result['count']
          this.init = true
        } else {
          this.$tip({
            content:Object.values(res.data.result).map(x=>x[0]).join("\n"),
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