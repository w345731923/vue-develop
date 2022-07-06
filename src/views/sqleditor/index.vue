<template>
    <div class="box">
        <!-- <div class="tool-buttons" :id="identity"> -->
        <div class="tool-buttons">
            <div class="row-button">
                <el-button-group>
                    <el-button size="small" color="#f2f2f2" @click="handleSave">
                        <el-icon>
                            <Avatar />
                        </el-icon>
                        保存
                    </el-button>
                    <el-button size="small" color="#f2f2f2" @click="handleSaveAs">
                        <el-icon>
                            <Avatar />
                        </el-icon>另存为
                    </el-button>
                    <el-button size="small" color="#f2f2f2" @click="handleExport">
                        <el-icon>
                            <Avatar />
                        </el-icon>导出
                    </el-button>
                    <el-button size="small" color="#f2f2f2" @click="handleFormat">
                        <el-icon>
                            <Avatar />
                        </el-icon>格式化
                    </el-button>
                    <el-button size="small" color="#f2f2f2">
                        <el-icon>
                            <Avatar />
                        </el-icon>文本
                    </el-button>
                    <el-button size="small" color="#f2f2f2">
                        <el-icon>
                            <Avatar />
                        </el-icon>自动提交
                    </el-button>
                    <el-button size="small" color="#f2f2f2">
                        <el-icon>
                            <Avatar />
                        </el-icon>提交
                    </el-button>
                    <el-button size="small" color="#f2f2f2">
                        <el-icon>
                            <Avatar />
                        </el-icon>回滚
                    </el-button>
                </el-button-group>
            </div>
            <div class="row-connect">
                <el-space wrap>
                    <el-select v-model="state.server_val" size="small" class="el-server">
                        <template #prefix> <img src="../../assets/hgdb16.png" /> </template>
                        <el-option v-for="item in state.server_option" :key="item.key" :label="item.label"
                            :value="item.key">
                            <span><img src="../../assets/hgdb16.png" style="margin: 0px 4px -2px -4px;" /></span>
                            <span style="
                                color: var(--el-text-color-secondary);
                                font-size: 13px;
                                ">{{ item.label }}</span>
                        </el-option>
                    </el-select>
                    <el-select v-model="state.db_val" placeholder="postgres" size="small">
                        <template #prefix> <img src="../../assets/database.png" /> </template>

                        <el-option v-for="item in state.db_option" :key="item.key" :label="item.label"
                            :value="item.key">
                            <span><img src="../../assets/database.png" style="margin: 0px 4px -2px -4px;" /></span>
                            <span style="
                                color: var(--el-text-color-secondary);
                                font-size: 13px;
                                ">{{ item.label }}</span>
                        </el-option>
                    </el-select>
                    <el-select v-model="state.schema_val" size="small">
                        <template #prefix> <img src="../../assets/schema.png" /> </template>

                        <el-option v-for="item in state.schema_option" :key="item.key" :value="item.key"
                            :label="item.label">
                            <span><img src="../../assets/schema.png" style="margin: 0px 4px -2px -4px;" /></span>
                            <span style="
                                color: var(--el-text-color-secondary);
                                font-size: 13px;
                                ">{{ item.label }}</span>
                        </el-option>
                    </el-select>
                    <el-button size="small" color="#f2f2f2" @click="handleExecute">
                        <el-icon>
                            <Avatar />
                        </el-icon>执行
                    </el-button>
                    <el-button size="small" color="#f2f2f2" @click="handleStop">
                        <el-icon>
                            <Avatar />
                        </el-icon>停止
                    </el-button>
                </el-space>
            </div>
        </div>
        <div class="split-content">
            <div class="codemirror pane_flex">
                <CodeMirror :sql="state.sql" ref="codeRef" :tabId="state.tabId" />
            </div>
            <div class="resizer_controls resizer_controls_column" @mousedown="dragSQLEditor($event, resultRef)"></div>
            <div class="query-result pane_flex" ref="resultRef">
                <el-tabs model-value="info" type="card">
                    <el-tab-pane label="信息" name="info" style="margin: 0.5rem">
                        <p style="margin: 0.3rem">> SQL:select now()</p>
                        <p style="margin: 0.3rem">> SUCCESS:OK</p>
                        <p style="margin: 0.3rem">> TIME:148ms</p>
                    </el-tab-pane>
                    <el-tab-pane label="查询结果" name="result" style="margin: 0.5rem">
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, Ref, toRefs, reactive, onMounted } from "vue";
import { } from "@/api/treeNode";
import { ResponseData } from "@/types";
import CodeMirror from "@/components/codemirror/CodeMirror.vue";
import { Avatar } from "@element-plus/icons-vue";
import {
    TreeNode,
    SQLEditorExec
} from "@/types";
import {
    api_initSQLEditor, api_formatSQL, api_executeSQL, api_findAllServer, api_sqleditorStatus, api_sqleditorPoll
    , api_changeServerItem
} from "@/api/sqleditor";
import { ElMessage } from "element-plus";
interface ISelect {
    key: string;
    label: string;
}
interface IState {
    tabId: string;
    treeData: TreeNode<any> | undefined;
    sql: string;
    server_val: string;
    server_option: ISelect[];
    db_val: string;
    db_option: ISelect[];
    schema_val: string;
    schema_option: ISelect[];
}
export default defineComponent({
    name: "SQLEditor",
    components: {
        CodeMirror,
        Avatar,
    },
    props: {
        tabId: {
            type: String,
            default: '',
        },
    },
    // props: ["identity"],
    setup(props, { emit }) {
        onMounted(() => {
            console.log('SQLEditor onMounted...');
            // state.tabId = sessionStorage.getItem("tabId") as string;
            let createSession = sessionStorage.getItem("create-sqleditor");
            if (createSession) {
                state.treeData = JSON.parse(createSession!) as TreeNode<any>;
                console.log("create-sqleditor createSession treeData = ", state.treeData);
                sessionStorage.setItem("create-sqleditor", "");
            }
            //初始化sql编辑器
            api_initSQLEditor(state.treeData!).then((resp) => {
                console.log("getDatabaseRole resp", resp);
                state.treeData!.contextId = resp.data;
            })
            //查询全部Server
            api_findAllServer().then((resp) => {
                console.log("findAllServer resp", resp);
                resp.data.map((item) => {
                    const server = item.split('\r\n');
                    let label = item[0]
                    if (server.length > 1) label = item[1]
                    state.server_option.push({ key: item, label: label })
                })
                console.log('state.server_option', state.server_option)
            })

        });
        const codeRef: Ref = ref(null); //sql对象
        const resultRef: Ref = ref(null); //结果集对象
        const { tabId } = toRefs(props);
        const state: IState = reactive({
            tabId: tabId.value,
            treeData: undefined, //树形菜单值
            sql: 'select \n 123',
            server_val: '-1',
            server_option: [{ key: '-1', label: '请选择服务' }],
            db_val: '-1',
            db_option: [{ key: '-1', label: '请选择数据库' }],
            schema_val: '-1',
            schema_option: [{ key: '-1', label: '请选择模式' }],
        })
        console.log('state', state)
        // const state = reactive({
        //   identity: props.identity,
        // });
        const handleSave = () => {
            alert('保存')
        }
        const handleSaveAs = () => {
            alert('另存为')
        }
        const handleExport = () => {
            alert('导出')
        }
        //格式化
        const handleFormat = () => {
            let sql = codeRef.value.getSelection();
            let noSelect = false;
            if (sql.length == 0) {
                noSelect = true;
                sql = codeRef.value.getSqlValue();
            }
            if (sql.trim().length == 0) return;
            console.log('handleFormat getSQL=', noSelect, sql.length,sql)
            api_formatSQL(sql).then((resp) => {
                console.log("formatSQL resp", resp);
                if (noSelect)
                    codeRef.value.setSqlValue(resp.data);
                else
                    codeRef.value.replaceSelection(resp.data);
            })
        }
        const handleExecute = () => {
            if (state.server_val == '-1' || state.db_val == '-1' || state.schema_val == '-1') {
                ElMessage({
                    message: '请选择要执行的数据库',
                    type: "warning",
                });
                return;
            }
            const sql = codeRef.value.getSqlValue();
            console.log('handleExecute sql = ', sql)
            const data = {} as SQLEditorExec;
            data.sql = sql;
            Object.assign(data, state.treeData);
            console.log("request data", data);
            api_executeSQL(data).then((resp1) => {
                console.log("api_executeSQL resp1", resp1);
                loopForQueryStatus(0)
            })
        }
        /**
         * 递归查询执行状态，状态=finish，执行查询结果
         */
        const loopForQueryStatus = (time = 1000) => {
            setTimeout(() => {
                api_sqleditorStatus(state.treeData!.contextId).then((resp2) => {
                    console.log("api_sqleditorStatus resp2", resp2);
                    if (resp2.data.status != 'finish') {
                        //查询未结束，继续查询
                        loopForQueryStatus();
                    } else {
                        //显示查询结果
                        api_sqleditorPoll(state.treeData!.contextId).then((respPoll) => {
                            console.log("api_sqleditorPoll respPoll", respPoll);
                            alert('执行完成')
                        })
                    }
                })
            }, time);
        }
        const handleStop = () => {
            alert('停止')
        }
        /**
         * 拖动树形菜单的边框
         */
        const dragSQLEditor = (event: any, codeRef: any) => {
            // console.log('dragSQLEditor event', event)
            // console.log('dragSQLEditor codeRef', codeRef)            
            const header = document.getElementsByClassName("header")[0];
            const right = document.getElementsByClassName("right")[0];
            console.log('right clientHeight', right.clientHeight)
            const clientHeight = header.clientHeight + right.clientHeight;
            document.onmousemove = function (e) {
                const moveY = e.clientY;
                console.log("moveY", moveY, '屏幕总高=', clientHeight, '底部设置高度为=', (clientHeight - moveY - 10));
                codeRef.style.flex = '0 1 ' + (clientHeight - moveY - 6) + 'px'
            };
            // 鼠标松开事件
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            };
            return false;
        };
        return {
            // ...toRefs(state),
            codeRef,
            resultRef,
            state,
            dragSQLEditor,
            handleSave,
            handleSaveAs,
            handleExport,
            handleFormat,
            handleExecute,
            handleStop
        };
    },
    data() {
        return {
            activeClass: "name",
        };
    },
})
</script>


<style scoped>
.box {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
}

.tool-buttons {
    padding: 4px 4px 8px 4px;
    background-color: #f2f2f2;
    flex: 0 0 auto;
    overflow: auto;
}

.split-content {
    flex: 1;
    display: flex;
    overflow: hidden;
    flex-direction: column;
}

.row-connect {
    padding-left: 1em;
}

.resizer-top-bottom {
    position: relative;
    flex: 0 1 auto;
    height: 2px;
    cursor: row-resize;
    background-color: var(--mdc-theme-background, #dedede);
}

.el-server {}
</style>
