var Mock = require("mockjs")
var express = require("express")
var router = express.Router();

//调用mock方法模拟数据
var treeResult = Mock.mock({
  code: 200,
  message: null,
  // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
  data: [
    {
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'oid': 1,
      'label': '@FIRST',
      'type': 'group'
    },
    {
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'oid': 2,
      'label': '@FIRST',
      'type': 'group'
    }
  ]
}
);
var normal = {
  code: 200,
  message: null,
  data: null
}

router.get("/root/list", function (req, res) {
  return res.json(treeResult);
})

router.post("/servergroup/add", function (req, res) {
  console.log('req', req.body)
  treeResult.data.push({ ...req.body, 'type': 'group' })
  console.log('treeResult', treeResult)
  return res.json(normal);
})

module.exports = router;