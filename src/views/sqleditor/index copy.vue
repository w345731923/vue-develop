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
                    <el-select v-model="ip_val" placeholder="localhost" size="small">
                        <el-option v-for="item in ip_option" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="db_val" placeholder="postgres" size="small">
                        <el-option v-for="item in db_option" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="schema_val" size="small">
                        <el-option v-for="item in schema_option" :key="item.value" :value="item.value"
                            :label="item.label">
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
                <!-- <CodeMirror /> -->
            </div>
            <div class="resizer_controls resizer_controls_column" @mousedown="dragSQLEditor($event, codeRef)"></div>
            <div class="query-result pane_flex" ref="codeRef">
                123
                <!-- <el-tabs model-value="info" type="card">
                    <el-tab-pane label="信息" name="info" style="margin: 0.5rem">
                        <p style="margin: 0.3rem">> SQL:select now()</p>
                        <p style="margin: 0.3rem">> SUCCESS:OK</p>
                        <p style="margin: 0.3rem">> TIME:148ms</p>
                    </el-tab-pane>
                    <el-tab-pane label="查询结果" name="result" style="margin: 0.5rem">
                    </el-tab-pane>
                </el-tabs> -->
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

} from "@/types";
import {
    initSQLEditor, formatSQL
} from "@/api/sqleditor";
import { getNodePath } from "@/utils/tree";

interface IState {
    tabId: string;
    treeData: TreeNode<any> | undefined;
    sql: string;
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
            state.tabId = sessionStorage.getItem("tabId") as string;
            let createSession = sessionStorage.getItem("create-sqleditor");
            if (createSession) {
                state.treeData = JSON.parse(createSession!) as TreeNode<any>;
                console.log("create-sqleditor createSession treeData = ", state.treeData);
                sessionStorage.setItem("create-sqleditor", "");
            }
            //初始化sql编辑器
            // initSQLEditor(state.treeData!).then((resp) => {
            //     console.log("getDatabaseRole resp", resp);
            //     state.treeData!.contextId = resp.data;
            // })
        });
        const codeRef: Ref = ref(null); //树形结果对象
        const { tabId } = toRefs(props);
        const state: IState = reactive({
            tabId: tabId.value,
            treeData: undefined, //树形菜单值
            sql: ''
        })
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
        const handleFormat = () => {
            alert('格式化')
            formatSQL('select * from public.aaa').then((resp) => {
                console.log("formatSQL resp", resp);
            })
        }
        const handleExecute = () => {
            alert('执行')
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
            // codeRef.style.flex = '0 1 500px'
            document.onmousemove = function (e) {
                const moveY = e.clientY;
                console.log("moveY", moveY, '屏幕总高=',clientHeight, '底部设置高度为=',(clientHeight - moveY - 10));
                // left.style.minWidth = moveX + "px";
                // left.style.maxWidth = "0px";
                codeRef.style.flex = '0 1 ' + (clientHeight - moveY - 10) + 'px'
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
            ip_option: [
                {
                    value: "localhost1",
                    label: "localhost1",
                },
                {
                    value: "localhost2",
                    label: "localhost2",
                },
                {
                    value: "localhost3",
                    label: "localhost3",
                },
            ],
            ip_val: "localhost1",
            db_option: [
                {
                    value: "postgres",
                    label: "postgres",
                },
                {
                    value: "test",
                    label: "test",
                },
            ],
            db_val: "postgres",
            schema_option: [
                {
                    value: "0",
                    label: "请选择模式",
                },
                {
                    value: "public",
                    label: "public",
                },
            ],
            schema_val: "0",
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
</style>
