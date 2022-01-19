var express = require("express")
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
    extended: true
}));

var router = express.Router();
router.use("/",require('./server'));


app.use("/api",router)
app.listen(3001)