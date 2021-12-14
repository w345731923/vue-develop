<template>
  <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
  </el-tree>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          label: "组1",
          icon: "el-icon-success",
          children: [
            {
              label: "localhost",
              children: [
                {
                  label: "postgres",
                  children: [
                    {
                      label: "模式",
                    },
                    {
                      label: "角色",
                    },
                    {
                      label: "表空间",
                    },
                    {
                      label: "管理",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Level one 2",
          children: [
            {
              label: "Level two 2-1",
              children: [
                {
                  label: "Level three 2-1-1",
                },
              ],
            },
            {
              label: "Level two 2-2",
              children: [
                {
                  label: "Level three 2-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "Level one 3",
          children: [
            {
              label: "Level two 3-1",
              children: [
                {
                  label: "Level three 3-1-1",
                },
              ],
            },
            {
              label: "Level two 3-2",
              children: [
                {
                  label: "Level three 3-2-1",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
  },
};
</script>