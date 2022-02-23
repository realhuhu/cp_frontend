let cos_url = "https://cp-1304907527.cos.ap-nanjing.myqcloud.com/"
// let api_url = "https://api.seutools.com/"
let api_url = "http://127.0.0.1:8000/"


let re_pattens = {
  username: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,16}$/,
  password: /^[a-zA-Z0-9-*/+.~!@#$%^&()]{6,16}$/,
  phone: /^1[3-9][0-9]{9}$/,
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  school: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
  code: /^[0-9]{4}$/,
  article_title: /^.{1,32}$/,
  article: /^.{1,2000}$/,
}

let validators = {
  username: [
    v => 16 >= v.length && v.length >= 1 || '长度在 1 到 16 个字符',
    v => re_pattens.username.test(v) || "不能含有非法字符",
  ],
  password: [
    v => 16 >= v.length && v.length >= 6 || '长度在 6 到 16 个字符',
    v => re_pattens.password.test(v) || "不能含有非法字符",
  ],
  confirm_password: password => [
    v => 16 >= v.length && v.length >= 6 || '长度在 6 到 16 个字符',
    v => re_pattens.password.test(v) || "不能含有非法字符",
    v => password === v || "两次密码不一致"
  ],
  phone: [
    v => re_pattens.phone.test(v) || "请输入11位电话号码"
  ],
  email: [
    v => re_pattens.email.test(v) || "邮箱格式错误"
  ],
  school: [
    v => 10 >= v.length && v.length >= 1 || '长度在 1 到 10 个字符',
    v => re_pattens.school.test(v) || "不能含有非法字符",
  ],
  code: [
    v => re_pattens.code.test(v) || "4位数验证码"
  ],
  article_title: [
    v => re_pattens.article_title.test(v) || "标题32字以内"
  ],
  article: [
    v => re_pattens.article.test(v) || "文章内容2000字以内"
  ]
}
export {
  api_url
}

export default {
  cos_url,
  api_url,
  validators,
  re_pattens
}