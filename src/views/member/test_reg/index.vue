<template>
  <el-form ref="formRef">
    <el-form-item label="测试">
      <el-input v-model="testValue"></el-input>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue';
import { ElForm } from 'element-plus';

export default defineComponent({
  setup() {
    const formRef = ref<InstanceType<typeof ElForm> | null>(null);
    const testValue = ref('');

    onMounted(() => {
      nextTick(() => {
        console.log('Form ref after mount:', formRef.value);
      });
    });

    return {
      formRef,
      testValue,
    };
  },
});
</script>
