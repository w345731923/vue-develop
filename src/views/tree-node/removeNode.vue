<template>
  <el-dialog
    title="删除对象"
    width="520px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    v-model="state.visible"
    @closed="onClose"
  >
    <el-form :model="ruleForm" style="margin: 0 10px">
      <h3>确定要删除'{{ data.object.name }}'吗？</h3>
      <div
        v-if="
          data.type != 'ServerGroup' &&
          data.type != 'Server' &&
          data.type != 'Database'
        "
      >
        <el-form-item label="级联删除">
          <el-switch v-model="ruleForm.isCascadeDelete" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button
        type="primary"
        @click="submitForm()"
        style="width: 80px; margin-right: 10px"
      >
        是
      </el-button>
      <el-button
        type="primary"
        @click="onClose"
        style="width: 80px; margin-right: 10px"
      >
        否
      </el-button>

      <el-button
        type="primary"
        @click="handleClick"
        v-if="data.type != 'ServerGroup' && data.type != 'Server'"
      >
        查看SQL
      </el-button>
    </template>
  </el-dialog>

  <el-dialog
    title="SQL预览"
    width="550px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    v-model="state.sqlVisible"
    @closed="state.sqlVisible = false"
  >
    <el-form>
      <el-input v-model="state.sqlpreview" type="textarea" :rows="15" />
    </el-form>
    <template #footer>
      <el-button
        @click="executeSQL"
        style="width: 80px; margin-right: 10px"
      >
        执行
      </el-button>
      <el-button
        @click="state.sqlVisible = false"
        style="width: 80px; margin-right: 10px"
      >
        取消
      </el-button>
    </template>
  </el-dialog>
</template>

    
<script lang="ts">
import { defineComponent, reactive, toRefs, watch, ref, Ref } from "vue";
import { showDropSQL } from "@/api/treeNode";
import { ResponseData, SQLDropPreview } from "@/types";
export default defineComponent({
  name: "RemoveDialog",
  props: {
    saveModal: Function,
    closeModal: Function,
    visible: {
      type: Boolean,
      default: false,
    },
    data: Object,
  },

  emits: ["saveModal", "closeModal"],
  setup(props, { emit }) {
    const { visible, data } = toRefs(props);
    const state = reactive({
      visible: visible.value,
      data: data.value,
      sqlVisible: false,
      sqlpreview: "",
    });
    watch(
      visible,
      (newValue) => {
        state.visible = newValue;
      },
      { immediate: true }
    );
    const ruleForm = reactive({
      isCascadeDelete: false,
    });
    /**
     * 取消按钮事件
     */
    const onClose = () => {
      emit("closeModal", false);
      ruleForm.isCascadeDelete = false;
    };
    /**
     * 保存按钮事件
     */
    const submitForm = () => {
      emit("saveModal", ruleForm);
    };
    /**
     * 查看SQL
     */
    const handleClick = () => {
      state.sqlVisible = true;
      const data: SQLDropPreview = {
        delObject: state.data,
        deleteOptions: {
          isCascadeDelete: ruleForm.isCascadeDelete,
        },
      };
      showDropSQL(data).then((resp: ResponseData<string>) => {
        state.sqlpreview = resp.data;
      });
    };
    /**
     * 执行SQL
     */
    const executeSQL = () => {
      state.sqlVisible = false;
      submitForm();

    };

    return {
      state,
      onClose,
      submitForm,
      ruleForm,
      handleClick,
      executeSQL
    };
  },
  methods: {},
});
</script>

<style scoped>
</style>
