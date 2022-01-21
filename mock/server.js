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
      'databaseOid': -1,
      'object': {
        'name': '@FIRST',
        'oid': 0
      },
      'serverId': null,
      'type': 'ServerGroup'
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
router.post("/root/list", function (req, res) {
  return res.json(treeResult);
})
var newGroup = {
  'databaseOid': -1,
  'object': {
    'name': '@FIRST',
    'oid': 0
  },
  'serverId': null,
  'type': 'ServerGroup'
}
router.post("/servergroup/add", function (req, res) {
  console.log('req', req.body)
  newGroup.object.name = req.body.serverGroupName;
  treeResult.data.push(newGroup)
  console.log('treeResult', treeResult)
  return res.json(normal);
})

module.exports = router;



// const dataSource = [
//   {
//     label: "组1",
//     type: "group",
//     children: [
//       {
//         label: "localhost",
//         type: "server",
//         children: [
//           {
//             label: "postgres",
//             type: "db-name",
//             children: [
//               {
//                 label: "模式",
//                 type: "schema-group",
//                 children: [
//                   {
//                     label: "public",
//                     type: "schema",
//                     children: [
//                       {
//                         label: "表",
//                         type: "table-group",
//                         children: [
//                           {
//                             label: "t_class",
//                             type: "table",
//                           },
//                           {
//                             label: "t_user",
//                             type: "table",
//                           },
//                           {
//                             label: "t_course",
//                             type: "table",
//                           },
//                         ],
//                       },
//                     ],
//                   },
//                 ],
//               },
//               {
//                 label: "角色",
//                 type: "role-group",
//                 children: [
//                   {
//                     label: "postgres",
//                     type: "user",
//                   },
//                   {
//                     label: "pg_execute_server_program",
//                     type: "user",
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];