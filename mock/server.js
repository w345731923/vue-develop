var Mock = require("mockjs")
var express = require("express")
var router = express.Router();

router.use("/list", function (req, res) {
  //调用mock方法模拟数据
  var data = Mock.mock({
    code: 200,
    message: null,
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'data|1-3': [
      {
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'oid|+1': 1,
        'label|+1': '@FIRST',
        'type': 'group'
      }
    ]
  }
  );
  return res.json(data);
})

module.exports = router;