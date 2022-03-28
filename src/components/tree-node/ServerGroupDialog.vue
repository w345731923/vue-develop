<template>
  <!-- :visible.sync="dialogFormVisible" -->
  <el-dialog
    :close-on-click-modal="false"
    v-model="visible"
    :title="textMap[dialogGroupStatus]"
    :destroy-on-close="true"
  >
    <!-- :model="dialogGroupObj" -->
    <el-form
      :rules="rules"
      ref="dataForm"
      label-position="left"
      label-width="70px"
      style="width: 300px; margin-left: 50px"
    >
      <el-form-item label="组名称" prop="serverGroupName">
        <el-input v-model="form.serverGroupName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="onClose"> 取消 </el-button>
      <el-button
        type="primary"
        @click="dialogGroupStatus === 'create' ? save() : update()"
      >
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  // computed, ref, watch, unref, watchEffect
} from "vue";
// import { ServerGroupForm } from "@/types";

export default defineComponent({
  name: "servergroupdialog",
  components: {
    // Avatar,
    // ColumnTab,
    // IndexTab,
  },
  props: {
    updateServerGroupDialog: Function,
    saveServerGroup: Function,
    updateServerGroup: Function,
    dialogGroupVisible: {
      type: Boolean,
      default: false,
    },
    dialogGroupStatus: String,
    // dialogGroupObj: Object,
  },
  setup(props, { emit }) {
    const { dialogGroupVisible } = toRefs(props);
    console.log("dialogGroupVisible", dialogGroupVisible.value);
    const state = reactive({
      visible: dialogGroupVisible.value,
    });
    watch(
      dialogGroupVisible,
      (newValue) => {
        state.visible = newValue;
      },
      { immediate: true }
    );
    const onClose = () => {
      emit("updateServerGroupDialog", false);
    };
    return {
      ...toRefs(state),
      onClose,
      // onConfirm
    };
  },
  data() {
    return {
      form: { serverGroupName: "" },
      textMap: {
        update: "edit",
        create: "create",
      },
      rules: {
        serverGroupName: [
          { required: true, message: "请填写组名称", trigger: "blur" },
        ],
      },
    };
  },
  // computed: {
  //   dialogShow: {
  //     get() {
  //       return this.dialogGroupVisible;
  //     },
  //     set(val) {
  //       this.$emit("updateServerGroupDialog", val);
  //     },
  //   },
  // },
  // methods: {
  //   save() {
  //     console.log("save this.form", this.form);
  //     this.$refs["dataForm"].validate((valid) => {
  //       if (valid) {
  //         this.saveServerGroup(this.form);
  //       }
  //     });
  //   },
  //   update() {
  //     console.log("update this.form", this.form);
  //     // this.updateServerGroup(this.form);
  //   }
  // }
});
</script>

<style scoped>
</style>
