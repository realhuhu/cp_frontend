<template>
  <var-card
    :title="title"
  >
    <template #extra>
      <div v-if="filters" id="filters">
        <var-select class="filter" clearable v-for="filter in filters" :placeholder="filter['name']"
                    v-model="filter['selected']" @change="to_filter" @clear="to_filter">
          <var-option v-for="option in filter['options']" :label="option"/>
        </var-select>
      </div>

      <div id="search">
        <var-input
          :hint="false"
          :line="false"
          text-color="#333"
          placeholder="搜索"
          v-model="search"
          @input="to_search"
          clearable>
          <template #prepend-icon>
            <var-icon id="search-btn" name="magnify" @click="to_search"/>
          </template>
        </var-input>
      </div>

      <var-table>
        <thead>
        <tr>
          <th :style="head.style" v-for="head in heads">{{head.title}}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(column,id) in data" :key="id">
          <td :class="{select:head.edit}"
              v-for="(head,index) of heads"
              @click="edit(column,head.edit,head.title)">
            {{heads[index].refer(column)}}
          </td>
        </tr>
        </tbody>

        <template #footer>
          <div class="footer">
            <var-pagination
              :simple="true"
              :current="page"
              :total="total"
              :size-option="[5, 10]"
              @change="change"
            />
          </div>
        </template>
      </var-table>
    </template>
  </var-card>

  <var-popup style="border-radius: 20px" v-model:show="show">
    <div id="popup">
      <div id="title">{{popup_title}}</div>
      <var-input placeholder="修改" textarea v-model="popup_value"/>
      <div id="btn">
        <var-button block type="primary" @click="update">确定</var-button>
      </div>
    </div>
  </var-popup>
</template>

<script>
  export default {
    name: "SuperTable",
    props: {
      title: null,
      filters: null,
      heads: null,
      data: null,
      total: null,
    },
    emits: ["reload", "search", "clean", "filter", "patch"],
    data() {
      return {
        search: "",
        page: 1,
        filter_query: {},
        show: false,

        popup_column: null,
        popup_title: "123",
        popup_value: "",
        popup_edit: null
      }
    },
    methods: {
      change(page, size) {
        this.page = 1
        this.$emit("reload", page, size, this.search)
      },
      to_search() {
        this.page = 1
        this.$emit("search", this.search)
      },
      clean() {
        this.page = 1
        this.$emit("clean")
      },
      to_filter() {
        this.page = 1
        this.$emit("filter", this.filters)
      },
      edit(column, edit, title) {
        if (!edit) return

        this.popup_column = column
        this.popup_title = title
        this.popup_edit = edit
        this.popup_value = column[edit]

        this.show = true
      },
      update() {
        this.popup_column[this.popup_edit] = this.popup_value
        this.$emit("patch", this.popup_column["id"], this.popup_edit, this.popup_value)
        this.show = false
      }
    },

  }
</script>

<style scoped>
  .select {
    cursor: pointer;
    border-radius: 3px;
  }

  .select:hover {
    background-color: #FFFFCC;
  }

  #search {
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

  #filters {
    margin: 20px;
  }

  .filter {
    margin: 20px;
    float: left;
    width: 200px;
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

</style>