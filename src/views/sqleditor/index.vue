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
                    <el-select v-model="ip_val" placeholder="localhost" size="mini">
                        <el-option v-for="item in ip_option" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="db_val" placeholder="postgres" size="mini">
                        <el-option v-for="item in db_option" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="schema_val" size="mini">
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
                <CodeMirror />
            </div>
            <div class="resizer_controls resizer_controls_column"></div>
            <div class="query-result pane_flex">
                <el-tabs model-value="info" type="card">
                    <el-tab-pane label="信息" name="info" style="margin: 0.5rem">
                        <p style="margin: 0.3rem">> SQL:select now()</p>
                        <p style="margin: 0.3rem">> SUCCESS:OK</p>
                        <p style="margin: 0.3rem">> TIME:148ms</p>
                    </el-tab-pane>
                    <el-tab-pane label="查询结果" name="result" style="margin: 0.5rem">
                        <!-- <TableEditor /> -->
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, unref, toRefs, reactive, onMounted } from "vue";
import { } from "@/api/treeNode";
import { ResponseData } from "@/types";
import CodeMirror from "@/components/codemirror/CodeMirror.vue";
import { Avatar } from "@element-plus/icons-vue";
import {
    TreeNode,

} from "@/types";
import {
    initSQLEditor
} from "@/api/sqleditor";
import { getNodePath } from "@/utils/tree";

interface IState {
    tabId: string;
    treeData: TreeNode<any> | undefined;
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
            initSQLEditor(state.treeData!).then((resp) => {
                console.log("getDatabaseRole resp", resp);
                state.treeData!.contextId = resp.data;
            })
        });
        const { tabId } = toRefs(props);
        const state: IState = reactive({
            tabId: tabId.value,
            treeData: undefined, //树形菜单值
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
        }
        const handleExecute = () => {
            alert('执行')
        }
        const handleStop = () => {
            alert('停止')
        }
        return {
            // ...toRefs(state),
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
