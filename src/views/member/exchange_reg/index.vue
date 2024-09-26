<template>
  <div class="exchange-container">
    <div class="form-header">
      <h3>数据交换</h3>
    </div>

    <!-- 上半部分：信息输入 -->
    <el-card shadow="hover">
      <el-form :model="formData" :rules="rules" ref="exchangeForm" label-width="120px">
        <el-row>
          <!-- 服务名 -->
          <el-col :span="24">
            <el-form-item label="服务名" prop="serviceName">
              <el-input v-model="formData.serviceName" placeholder="请输入服务名"></el-input>
            </el-form-item>
          </el-col>

          <!-- 提供方名 -->
          <el-col :span="24">
            <el-form-item label="提供方名" prop="providerName">
              <el-input v-model="formData.providerName" placeholder="请输入提供方名"></el-input>
            </el-form-item>
          </el-col>

          <!-- handle名 -->
          <el-col :span="24">
            <el-form-item label="handleName" prop="handleName">
              <el-input v-model="formData.handleName" placeholder="请输入handle名"></el-input>
            </el-form-item>
          </el-col>

          <!-- 数据库名 -->
          <el-col :span="24">
            <el-form-item label="数据库名" prop="databaseName">
              <el-input v-model="formData.databaseName" placeholder="请输入数据库名"></el-input>
            </el-form-item>
          </el-col>

          <!-- 数据表名 -->
          <el-col :span="24">
            <el-form-item label="数据表名" prop="tableName">
              <el-input v-model="formData.tableName" placeholder="请输入数据表名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 提交和重置按钮 -->
        <el-row>
          <el-col :span="24" class="button-row">
            <el-button type="primary" @click="submitForm">提交</el-button>
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
              <el-icon><ele-Setting /></el-icon> 选择展示列
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-checkbox-group v-model="checkedColumns">
                  <el-dropdown-item><el-checkbox label="serviceName">服务名</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox label="providerName">提供方名</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox label="tableName">数据表名</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox label="exchangeResult">交换结果</el-checkbox></el-dropdown-item>
                </el-checkbox-group>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
      </el-row>

      <el-table :data="tableData" stripe>
        <!-- 列通过选中控制展示 -->
        <el-table-column v-if="checkedColumns.includes('serviceName')" prop="serviceName" label="服务名" />
        <el-table-column v-if="checkedColumns.includes('providerName')" prop="providerName" label="提供方名" />
        <el-table-column v-if="checkedColumns.includes('tableName')" prop="tableName" label="数据表名" />
        <el-table-column v-if="checkedColumns.includes('exchangeResult')" prop="exchangeResult" label="交换结果" />
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
import { submitExchangeData, getExchangeTableData } from "/@/api/member/exchange_reg";
import { ExchangeForm, getDefaultExchangeForm, ExchangeTableData } from './component/model';

export default defineComponent({
  name: 'ExchangePage',
  setup() {
    // 表单数据和验证规则
    const formData = ref<ExchangeForm>(getDefaultExchangeForm());

    const rules = {
      serviceName: [{ required: true, message: '请输入服务名', trigger: 'blur' }],
      providerName: [{ required: true, message: '请输入提供方名', trigger: 'blur' }],
      handleName: [{ required: true, message: '请输入handle名', trigger: 'blur' }],
      databaseName: [{ required: true, message: '请输入数据库名', trigger: 'blur' }],
      tableName: [{ required: true, message: '请输入数据表名', trigger: 'blur' }]
    };

    const exchangeForm = ref<FormInstance | null>(null);
    const tableData = ref<ExchangeTableData[]>([]);
    const checkedColumns = ref<string[]>(['serviceName', 'providerName', 'tableName', 'exchangeResult']);

    // 提交表单
    const submitForm = () => {
      exchangeForm.value?.validate((valid: boolean) => {
        if (valid) {
          submitExchangeData(formData.value).then(() => {
            ElMessage.success('提交成功');
            // 刷新表格数据
            fetchTableData();
          }).catch(() => {
            ElMessage.error('提交失败');
          });
        } else {
          ElMessage.error('请完善表单信息');
        }
      });
    };

    // 重置表单
    const resetForm = () => {
      if (exchangeForm.value) {
        exchangeForm.value.resetFields();
      }
    };

    // 获取展示列数据
    const fetchTableData = () => {
      getExchangeTableData().then((response: { data: ExchangeTableData[] }) => {
        tableData.value = response.data;
      }).catch(() => {
        ElMessage.error('获取数据失败');
      });
    };

    onMounted(() => {
      fetchTableData();  // 页面加载时获取表格数据
    });

    return {
      formData,
      rules,
      exchangeForm,
      tableData,
      checkedColumns,
      submitForm,
      resetForm,
    };
  }
});
</script>

<style scoped>
.exchange-container {
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
