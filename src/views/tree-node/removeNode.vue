<template>
  <el-dialog
    title="删除对象"
    width="550px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    v-model="state.visible"
    @closed="onClose"
  >
    <el-form :model="ruleForm" style="margin:0 10px">
      <h3>确定要删除'{{ data.object.name }}'吗？</h3>
      <div v-if="data.type != 'ServerGroup' && data.type != 'Server'">
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
        @click="onClose"
        v-if="data.type != 'ServerGroup' && data.type != 'Server'"
      >
        查看SQL
      </el-button>
    </template>
  </el-dialog>
</template>

    
<script lang="ts">
import { defineComponent, reactive, toRefs, watch, ref, Ref } from "vue";

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

    return {
      state,
      onClose,
      submitForm,
      ruleForm,
    };
  },
  methods: {},
});
</script>

<style scoped>
</style>
