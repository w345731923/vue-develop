<template>
  <div :class="['alert', 'type']">
    <div class="alert-content">{{ content }}</div>
  </div>
</template>


<script>
/**
 * 这种只接收 props，没有定义 data、methods、computed 等响应数据的组件，被称为无状态组件
 */
export default {
  setup() {},
  name: "Alert",
  props: ["type", "content"],
};
</script>
