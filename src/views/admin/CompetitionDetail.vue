<template>
  <var-card title="竞赛详情">
    <template #extra>
      <div v-if="ready" style="margin: 20px">
        <div style="font-size: 30px;font-weight: bolder;line-height: 80px">
          {{data.title}}
          <var-chip :type="data.is_active?'success':'warning'">{{data.is_active?"正常":"屏蔽"}}</var-chip>
        </div>
        <div style="font-size: 20px">
          <span style="margin: 20px 50px 0 0">开始时间：{{data.start_time.replace("T"," ")}}</span>
          <span style="margin: 20px 50px 0 0">结束时间：{{data.end_time.replace("T"," ")}}</span>
          <span style="margin: 20px 50px 0 0">答题限时:{{data.time_limit}}分钟</span>
        </div>

      </div>
      <div style="margin: 10px">
        <DynamicTable
          title="题目"
          :ready="ready"
          :heads="heads"
          :data="table_data"
          :total="total"
          @search="search"
          @update="update"
        />
      </div>
    </template>
  </var-card>
</template>

<script>
  import DynamicTable from "components/tableView/DynamicTable";

  export default {
    name: "CompetitionDetail",
    components: {
      DynamicTable
    },
    data() {
      return {
        data: null,
        ready: false,
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
              return parseInt(100 * column["answer_num"] / column["correct_answer_num"]) + "%"
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

        table_data: null,
        total: null,
      }
    },
    methods:{
      search(){

      }
    },
    beforeCreate() {
      this.$ajax.api.get(
        `admin/competition/${this.$route.params.id}/`,
      ).then(res => {
        if (res.data.msg !== "错误") {
          this.data = res.data.result
          this.total = this.data.questions.length
          this.table_data = this.data.questions.slice(0, 10)
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
  }
</script>

<style scoped>
  #back {
    float: right;
    margin: 0 50px;
  }
</style>