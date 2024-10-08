<template>
  <div class="negotiation-detail">
    <el-drawer v-model="isShowDialog" size="80%" direction="ltr">
      <template #header>
        <h4>详细数据协商信息</h4>
      </template>
      <el-form ref="formRef" :model="formData" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务ID">{{ formData.service_id }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务名">{{ formData.service_name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据库名称">{{ formData.db_name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据表名称">{{ formData.table_name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求状态">{{ formData.status }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">{{ formData.remarks }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue';
import { listNegotiation } from '/@/api/member/negotiation'; // 引入 listNegotiation 接口函数
import { DataDisplayState } from '/@/views/member/negotiation/component/model'; // 引入 DataDisplayState 接口
import { ElMessage } from 'element-plus'; // 引入 ElMessage 组件

export default defineComponent({
  name: 'NegotiationDetail',
  setup() {
    const state = reactive<{
      isShowDialog: boolean;
      formData: DataDisplayState['tableData'][0];
    }>({
      isShowDialog: false,
      formData: {
        service_id: 0,
        service_name: '',
        db_name: '',
        table_name: '',
        status: '',
        remarks: null,
      },
    });

    const openDialog = (row: DataDisplayState['tableData'][0]) => {
      // 调用 listNegotiation 接口函数获取详细信息
      listNegotiation({ id: row.service_id })
        .then((response) => {
          if (response.data.status === 'success' && response.data.item) {
            state.formData = response.data.item; // 确保 item 存在
            state.isShowDialog = true;
          } else {
            ElMessage.error('获取详细信息失败');
          }
        })
        .catch((error) => {
          console.error('网络错误，请稍后重试', error);
          ElMessage.error('网络错误，请稍后重试');
        });
    };

    const closeDialog = () => {
      state.isShowDialog = false;
    };

    return {
      ...toRefs(state),
      openDialog,
      closeDialog,
    };
  },
});
</script>

<style scoped>
.negotiation-detail :deep(.el-form-item--large .el-form-item__label) {
  font-weight: bolder;
}
</style>