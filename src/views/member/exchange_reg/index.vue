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
            <el-form-item label="服务ID" prop="serviceID">
              <el-input v-model="formData.serviceID" placeholder="请输入服务ID"></el-input>
            </el-form-item>
          </el-col>
          <!-- handleID -->
          <el-col :span="24">
            <el-form-item label="Handle ID" prop="handleID">
              <el-input v-model="formData.handleID" placeholder="请输入HandID"></el-input>
            </el-form-item>
          </el-col>
          <!-- handle_name -->
          <el-col :span="24">
            <el-form-item label="句柄名" prop="handle_name">
              <el-input v-model="formData.handle_name" placeholder="请输入Hand Name"></el-input>
            </el-form-item>
          </el-col>
          <!-- 数据交换格式 -->
          <el-col :span="24">
            <el-form-item label="数据交换格式" prop="format">
              <el-input v-model="formData.format" placeholder="请输入数据交换格式"></el-input>
            </el-form-item>
          </el-col>
          <!-- 数据交换协议 -->
          <el-col :span="24">
            <el-form-item label="数据交换协议" prop="protocol">
              <el-input v-model="formData.protocol" placeholder="请输入protocol"></el-input>
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
          <div class="data-request">Handle 列表</div>
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
                  <el-dropdown-item><el-checkbox label="providerName">提供方ID</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox label="serviceID">服务ID</el-checkbox></el-dropdown-item>
                  <el-dropdown-item><el-checkbox label="handleID">Handle ID</el-checkbox></el-dropdown-item>
                </el-checkbox-group>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
      </el-row>

      <el-table :data="paginatedTableData" stripe>
        <!-- 列通过选中控制展示 -->
        <el-table-column v-if="checkedColumns.includes('serviceName')" prop="service_name" label="服务名" />
        <el-table-column v-if="checkedColumns.includes('providerName')" prop="provider_id" label="提供方ID" />
        <el-table-column v-if="checkedColumns.includes('serviceID')" prop="service_id" label="服务ID" />
        <el-table-column v-if="checkedColumns.includes('handleID')" prop="handle_id" label="Handle ID" />
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        class="mt15"
        background
        layout="prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="tableData.length"
        @current-change="handlePageChange"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed} from 'vue';
import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';
import { submitExchangeData, listHandle } from "/@/api/member/exchange_reg";
import { ExchangeForm, getDefaultExchangeForm, ExchangeTableData } from './component/model';

export default defineComponent({
  name: 'ExchangePage',
  setup() {
    // 表单数据和验证规则
    const formData = ref<ExchangeForm>(getDefaultExchangeForm());

    const rules = {
      serviceID: [{ required: true, message: '请输入服务ID', trigger: 'blur' }],
    };

    const exchangeForm = ref<FormInstance | null>(null);
    const tableData = ref<ExchangeTableData[]>([]);
    const checkedColumns = ref<string[]>(['serviceName', 'providerName', 'serviceID', 'handleID']);

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
      const query = {
        user_type: "owner",
        owner_id: 12,
      }
        listHandle(query ).then((response) => {
        tableData.value = response.data.items;
        console.log(response.data);
      }).catch(() => {
        //ElMessage.error('获取数据失败');
      });
    };

    // 分页相关
    const currentPage = ref(1);
    const pageSize = ref(10);

    // 计算分页后的数据
    const paginatedTableData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return tableData.value.slice(start, end);
    });

    // 分页处理
    const handlePageChange = (page: number) => {
      currentPage.value = page;
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
      handlePageChange,
      paginatedTableData,
      currentPage,
      pageSize,
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


/* 调整输入栏之间的间距 */
.el-form-item {
  margin-bottom: 20px; /* 调整输入栏之间的垂直间距 */
}

.el-col {
  margin-bottom: 10px; /* 调整列之间的垂直间距 */
}

.el-row {
  margin-bottom: 20px; /* 调整行之间的垂直间距 */
}

.el-form-item:last-child {
  margin-bottom: 0; /* 最后一个输入栏不需要额外的间距 */
}

.el-button {
  margin-top: 10px; /* 调整按钮之间的垂直间距 */
}

.el-card {
  margin-bottom: 20px; /* 调整卡片之间的垂直间距 */
}

/* 分页组件样式 */
.el-pagination {
  margin-top: 20px;
  text-align: center;
}

</style>