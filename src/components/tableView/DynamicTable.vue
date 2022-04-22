<template>
  <var-card
    :title="title"
  >
    <template #extra>
      <var-row>
        <var-col class="filters" span="4" v-for="head in heads.filter(x=>x.filter)">
          <var-select
            class="filter"
            clearable
            :placeholder="head['title']"
            v-model="head['selected']"
            @change="search"
            @clear="search">
            <var-option v-for="option in head['options']" :label="option"/>
          </var-select>
        </var-col>
      </var-row>


      <div id="search-wrap">
        <var-input
          :hint="false"
          :line="false"
          text-color="#333"
          placeholder="搜索"
          v-model="search_text"
          @input="search"
          @clear="search"
          clearable>
          <template #prepend-icon>
            <var-icon id="search-btn" name="magnify" @click="search"/>
          </template>
        </var-input>
      </div>

      <var-table v-if="ready">
        <thead>
        <tr>
          <th :style="head.style" v-for="head in heads">{{head.title}}</th>
          <th v-if="extend" :style="extend.style.head">{{extend.title}}</th>
        </tr>
        </thead>
        <tbody>

        <tr v-for="(column,id) in data" :key="id">
          <td :class="{selected:head.editable}"
              v-for="(head,index) of heads"
              @click="edit(head,column)">
            <var-chip class="chip" :style="head.tag_style" v-if="head.tag==='chip'">
              {{heads[index].serialize?heads[index].serialize(column):column[heads[index].refer]}}
            </var-chip>
            <div v-else :style="head.tag_style">
              {{heads[index].serialize?heads[index].serialize(column):column[heads[index].refer]}}
            </div>
          </td>
          <td v-if="extend" :style="extend.style.body" @click="extra(column)">
            <slot name="extend"></slot>
          </td>
        </tr>
        </tbody>


        <template #footer>
          <div class="footer">
            <var-pagination
              :simple="false"
              :current="page"
              :total="total"
              :show-size-changer="false"
              @change="paginate"
              show-quick-jumper
            />
          </div>
        </template>
      </var-table>

      <div id="loading" v-else>
        加载中...
      </div>

    </template>
  </var-card>

  <var-popup style="border-radius: 20px" v-model:show="popup">
    <div id="popup">
      <div id="title">{{popup_head.title}}</div>
      <var-input v-if="popup_type===0" placeholder="修改" textarea v-model="popup_value"/>
      <var-select style="padding: 30px" v-else-if="popup_type===1" placeholder="请选择一个选项" v-model="popup_value">
        <var-option v-for="option in popup_head.options" :label="option"/>
      </var-select>
      <div id="btn">
        <var-button block type="primary" @click="update">确定</var-button>
      </div>
    </div>
  </var-popup>
</template>

<script>
  export default {
    name: "DynamicTable",
    props: {
      ready: null,
      title: String,
      total: Number,
      heads: Array,
      data: Array,

      extend: null
    },
    emits: [
      "search",
      "update",
      "extra",
    ],
    data() {
      return {
        search_text: "",
        filters: "",
        page: 1,

        popup: false,
        popup_title: "",
        popup_type: "",
        popup_head: "",
        popup_column: "",
        popup_value: "",
      }
    },
    methods: {
      paginate(page) {
        this.page = page
        this.search()
      },
      edit(head, column) {
        if (!head.editable) return
        this.popup_head = head
        this.popup_column = column
        if (head.edit_type === "select") {
          this.popup_type = 1
        } else {
          this.popup_type = 0
        }
        this.popup_value = head.serialize ? head.serialize(column) : column[head.refer]
        this.popup = true
      },
      search(flag) {
        if (flag) this.page = 1
        let query_obj = {
          page: this.page,
          limit: 10
        }
        if (this.search_text) {
          query_obj.search = this.search_text
        }
        for (let head of this.heads.filter(x => x.filter)) {
          if (head.selected !== undefined) {
            query_obj[head.refer] = head.deserialize ? head.deserialize(head.selected) : head.selected
          }
        }
        let query = Object.keys(query_obj).map(x => x + "=" + query_obj[x]).join("&")
        this.$emit("search", query)
      },
      update() {
        let column = this.popup_column
        let head = this.popup_head
        let id = Number(column[this.heads[0].refer])
        let value = head.deserialize ? head.deserialize(this.popup_value) : this.popup_value
        column[head.refer] = value
        let data = {
          [head.refer]: value
        }
        this.$emit("update", id, data)
        this.popup = false
      },
      extra(column) {
        this.$emit("extra", column);
      }
    },
  }
</script>

<style scoped>
  .filters {
    margin: 20px;
  }

  #search-wrap {
    float: right;
    height: 30px;
    margin: 15px;
    padding: 2px 10px;
    width: 200px;
    border: 1px solid #4ebaee;
    border-radius: 10px;
  }

  #search-btn {
    padding: 3px;
    margin: 2px;
    border-radius: 5px;
    background-color: #fff;
    border: 1px dashed rgba(200, 200, 200, 0.8);
    cursor: pointer;
  }

  .chip {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #8fdbf4
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 60px;
    padding: 0 16px;
  }

  #loading {
    height: 30vh;
    text-align: center;
  }

  #popup {
    width: 500px;
    border-radius: 30px;
    margin: 30px 50px;
  }

  #title {
    text-align: center;
    font-size: 30px;
  }

  #btn {
    margin: 30px;
  }

  .selected {
    cursor: pointer;
  }

  .selected:hover {
    background-color: #d7d7d7;
  }
</style>
