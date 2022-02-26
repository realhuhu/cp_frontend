<template>
  <dynamic-table
    title="公告"
    :ready="ready"
    :extend="extend"
    :heads="heads"
    :data="data"
    :total="total"
    @search="search"
    @update="update"
    @extra="edit">
    <template #extend>
      <div style="padding: 10px 30px">
        <var-button block type="warning">编辑</var-button>
      </div>
    </template>
  </dynamic-table>

  <var-button type="primary" @click="pop" style="float: right;margin: 20px">添加公告</var-button>

  <div id="mask" v-if="show" @click="hide"></div>

  <div id="wrap" :class="{hide:!show}">
    <div class="poster">
      <var-input id="title" placeholder="请输入标题" v-model="title"/>
      <var-input id="description" placeholder="请输入简介" v-model="description"/>
      <div style="border: 1px solid #ccc;">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          editorId="editor"
          :defaultConfig="toolbarConfig"
          :mode="mode"
        />
        <Editor
          style="height: 500px; overflow-y: hidden;"
          editorId="editor"
          :defaultConfig="editorConfig"
          :mode="mode"
        />
      </div>
      <div style="margin: 10px 0" class="clear-fix">
        <var-button class="right" type="success" @click="post(true)">发布</var-button>
        <var-button class="right" style="margin: 0 10px" type="primary" @click="post(false)">保存草稿</var-button>
      </div>
    </div>

  </div>


</template>

<script>
  import '@wangeditor/editor/dist/css/style.css'
  import {Editor, Toolbar, getEditor, removeEditor} from '@wangeditor/editor-for-vue'
  import {SlateTransforms} from '@wangeditor/editor'

  import DynamicTable from "components/tableView/DynamicTable";

  export default {
    name: "Notice",
    components: {
      Editor,
      Toolbar,
      DynamicTable
    },
    data() {
      return {
        show: false,
        title: "",
        description: "",
        toolbarConfig: {
          toolbarKeys: [
            "headerSelect",
            "bold",
            "underline",
            "italic",
            {
              "key": "group-more-style",
              "title": "更多",
              "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path></svg>",
              "menuKeys": [
                "through",
                "code",
                "sup",
                "sub",
                "clearStyle"
              ]
            },
            "color",
            "bgColor",
            "|",
            "fontSize",
            "fontFamily",
            "lineHeight",
            "|",
            "bulletedList",
            "numberedList",
            "todo",
            {
              "key": "group-justify",
              "title": "对齐",
              "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\"></path></svg>",
              "menuKeys": [
                "justifyLeft",
                "justifyRight",
                "justifyCenter",
                "justifyJustify"
              ]
            },
            {
              "key": "group-indent",
              "title": "缩进",
              "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z\"></path></svg>",
              "menuKeys": [
                "indent",
                "delIndent"
              ]
            },
            "|",
            "emotion",
            "insertLink",
            {
              "key": "group-image",
              "title": "图片",
              "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z\"></path></svg>",
              "menuKeys": [
                "insertImage",
                "uploadImage"
              ]
            },
            "insertTable",
            "divider",
            "|",
            "undo",
            "redo",
            "fullScreen"
          ]
        },
        editorConfig: {
          placeholder: '请输入内容...',
          MENU_CONF: {
            insertImage: {
              checkImage(src) {
                if (src.indexOf('http') !== 0) {
                  return '图片网址必须以 http/https 开头';
                }
                return true;
              }
            },
            uploadImage: {
              server: "https://api.seutools.com/common/image/",
              fieldName: 'file',
              maxFileSize: 5 * 1024 * 1024,
              maxNumberOfFiles: 1,
              allowedFileTypes: ['image/*'],
              headers: {
                Authorization: this.$cookies.get("token")
              },
              base64LimitKB: 5,
              customInsert(result, insertFn) {
                if (result.code === 120) {
                  let url = "https://cp-1304907527.cos.ap-nanjing.myqcloud.com/" + result.result.data
                  insertFn(url)
                } else {
                  this.$tip({
                    content: result.msg,
                    type: "warning",
                    duration: 1000,
                  })
                }
              },
            }
          }
        },
        mode: 'default',
        pid: null,

        heads: [
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
              width: "10%",
            },
          },
          {
            title: "简介",
            refer: "description",
            editable: true,
            style: {
              width: "20%",
            },
          },
          {
            title: "创建时间",
            refer: "create_time",
            style: {
              width: "20%",
            },
            serialize: column => column["create_time"].substring(0, 16).replace("T", " ")
          },
          {
            title: "更新时间",
            refer: "update_time",
            style: {
              width: "20%",
            },
            serialize: column => column["update_time"].substring(0, 16).replace("T", " ")
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
            title: "是否发布",
            refer: "published",
            editable: true,
            filter: true,
            edit_type: "select",
            style: {
              width: "10%",
            },
            serialize: column => column["published"] ? "已发布" : "草稿",
            deserialize: raw => raw === "已发布",
            options: [
              "已发布",
              "草稿",
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
      }
    },
    methods: {
      post(published) {
        let editor = getEditor("editor")
        let title = this.title
        let description = this.description
        let json_raw = JSON.stringify(editor.children)

        if (!title || !description || editor.isEmpty()) return

        let content = editor.getHtml()
        let data = {
          title,
          description,
          json_raw,
          content,
          published
        }
        this.$ajax.api({
            method: this.pid ? "PATCH" : 'POST',
            url: this.pid ? `admin/article/${this.pid}/` : "admin/article/",
            data
          }
        ).then(res => {
          if (res.data.msg !== "错误") {
            this.$tip({
              content: "上传成功",
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
          this.hide()
          this.search("")
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 3000,
          })
        })

      },
      search(query) {
        this.ready = false
        this.$ajax.api.get(
          "admin/article/?" + query,
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
          `admin/article/${id}/`,
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
      edit(column) {
        this.pid = column.id
        this.title = column.title
        this.description = column.description
        let json_raw = JSON.parse(column.json_raw)
        this.show = true
        let editor = getEditor("editor")
        SlateTransforms.insertNodes(editor, json_raw)
        SlateTransforms.removeNodes(editor, {at: [0]})
      },
      pop() {
        this.show = true
        this.pid = null
      },
      hide() {
        this.show = false
        this.clean()
      },
      clean() {
        this.title = ""
        this.description = ""
        let editor = getEditor("editor")
        editor.select([])
        editor.deleteFragment()
      }
    },
    beforeCreate() {
      this.$ajax.api.get(
        "admin/article/",
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
    },
    beforeDestroy() {
      const editor = getEditor("editor")
      if (editor == null) return
      editor.destroy()
      removeEditor("editor")
    }
  }
</script>

<style scoped>
  #wrap {
    position: fixed;
    left: 15vw;
    top: 50px;
    z-index: 1020;
    width: 70vw;
    background-color: white;
    border-radius: 10px;
  }

  .poster {
    padding: 50px;
  }

  #title {
    padding: 10px;
  }

  #description {
    padding: 10px;
  }

  .hide {
    visibility: hidden;
  }

  #mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(20, 20, 20, .4);
    z-index: 1010;
  }
</style>