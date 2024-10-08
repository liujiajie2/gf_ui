<template>
  <div class="calculation-container">
    <div class="form-header">
      <h3>计算页面</h3>
    </div>

    <!-- 上半部分：信息输入 -->
    <el-card shadow="hover">
      <el-form :model="formData" :rules="rules" ref="calculationForm" label-width="120px">
        <el-row>
          <!-- 服务名 -->
          <el-col :span="24">
            <el-form-item label="服务名" prop="serviceName">
              <el-input v-model="formData.serviceName" placeholder="请输入服务名"></el-input>
            </el-form-item>
          </el-col>

          <!-- 用户编码 -->
          <el-col :span="24">
            <el-form-item label="用户编码" prop="userCode">
              <el-input v-model="formData.userCode" placeholder="请输入用户编码"></el-input>
            </el-form-item>
          </el-col>

          <!-- 起始时间 -->
           
          <el-col :span="24">
            <el-form-item label="起始时间" prop="startTime">
              <el-date-picker v-model="formData.startTime" type="datetime" format="YYYY-MM-DD" value-format="YYYY-MM-DD" placeholder="请输入起始时间"></el-date-picker>
              <!-- <el-input v-model="formData.startTime" placeholder="请输入起始时间"></el-input> -->
            </el-form-item>
          </el-col>

          <!-- 终止时间 -->
          <el-col :span="24">
            <el-form-item label="终止时间" prop="endTime">
              <el-date-picker v-model="formData.endTime" type="datetime" format="YYYY-MM-DD" value-format="YYYY-MM-DD" placeholder="请输入终止时间"></el-date-picker>

              <!-- <el-input v-model="formData.endTime" placeholder="请输入终止时间"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 查询和重置按钮 -->
        <el-row>
          <el-col :span="24" class="button-row">
            <el-button type="primary" @click="submitForm">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 下半部分：信息展示框 -->
    <el-card shadow="hover" class="data-table mt15">
      <el-row>
        <el-col :span="24">
          <div class="data-request">数据展示</div>
        </el-col>
      </el-row>

      <!-- 列选择控制组件 -->
      <el-row class="column-control">
        <el-tooltip content="选择展示列" placement="top">
          <el-dropdown>
            <el-button type="text">
              <el-icon><el-setting /></el-icon> 选择展示列
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-checkbox-group v-model="checkedColumns">
                  <el-dropdown-item><el-checkbox label="serviceName">服务名</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox label="userCode">用户编码</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox label="userName">户名</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox label="startTime">起始时间</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox label="endTime">终止时间</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox label="electricityUsage">用电量</el-checkbox></el-dropdown-item>
                </el-checkbox-group>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
      </el-row>

      <el-table :data="tableData" stripe>
        <!-- 列通过选中控制展示 -->
        <el-table-column v-if="checkedColumns.includes('serviceName')" prop="serviceName" label="服务名" />
        <el-table-column v-if="checkedColumns.includes('userCode')" prop="userCode" label="用户编码" />
        <el-table-column v-if="checkedColumns.includes('userName')" prop="userName" label="户名" />
        <el-table-column v-if="checkedColumns.includes('startTime')" prop="startTime" label="起始时间" />
        <el-table-column v-if="checkedColumns.includes('endTime')" prop="endTime" label="终止时间" />
        <el-table-column v-if="checkedColumns.includes('electricityUsage')" prop="electricityUsage" label="用电量" />
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
//import { queryCalculationResult } from "/@/api/member/calculate_reg";
import type { CalculationForm, CalculationTableData } from './component/model';

export default defineComponent({
  name: 'CalculationPage',
  setup() {
    // 表单数据和验证规则
    const formData = ref<CalculationForm>({
      serviceName: '',
      userCode: '',
      startTime: '',
      endTime: ''
    });

    const rules = {
      serviceName: [{ required: true, message: '请输入服务名', trigger: 'blur' }],
      userCode: [{ required: true, message: '请输入用户编码', trigger: 'blur' }],
      startTime: [{ required: true, message: '请输入起始时间', trigger: 'blur' }],
      endTime: [{ required: true, message: '请输入终止时间', trigger: 'blur' }]
    };

    const calculationForm = ref<FormInstance | null>(null);
    const tableData = ref<CalculationTableData[]>([]);
    const checkedColumns = ref<string[]>(['serviceName', 'userCode', 'userName', 'startTime', 'endTime', 'electricityUsage']);

    // 查询数据
    const submitForm = () => {
      // calculationForm.value?.validate((valid: boolean) => {
      //   if (valid) {
      //     queryCalculationResult(formData.value).then((response: { data: CalculationTableData[] }) => {
      //       tableData.value = response.data;
      //       ElMessage.success('查询成功');
      //     }).catch(() => {
      //       ElMessage.error('查询失败');
      //     });
      //   } else {
      //     ElMessage.error('请完善表单信息');
      //   }
      // });
    };

    // 重置表单
    const resetForm = () => {
      if (calculationForm.value) {
        calculationForm.value.resetFields();
      }
    };

    return {
      formData,
      rules,
      calculationForm,
      tableData,
      checkedColumns,
      submitForm,
      resetForm
    };
  }
});
</script>

<style scoped>
.calculation-container {
  padding: 20px;
}

.button-row {
  text-align: right;
}

.data-table {
  margin-top: 20px;
}

.data-request {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.column-control {
  text-align: left;
  margin-bottom: 10px;
}

.el-table th,
.el-table td {
  padding: 8px;
  text-align: center;
}

.el-input {
  width: 100%;
}
</style>
