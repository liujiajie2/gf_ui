<template>
  <div class="negotiation-container">
    <div class="form-header">
      <h3>需求申请</h3>
    </div>

    <el-card shadow="hover">
      <!-- 表单部分 -->
      <el-form :model="formData" :rules="rules" ref="negotiationForm" label-width="120px">
        <el-row>
          <!-- 服务名 -->
          <el-col :span="24">
            <el-form-item label="服务名" prop="serviceName">
              <el-input v-model="formData.serviceName" placeholder="请输入服务名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <div v-for="(field, index) in formData.fieldContent" :key="index" class="field-row">
          <el-row :gutter="30">
            <el-col :span="10">
              <el-form-item label="数据库名" :prop="'fieldContent.' + index + '.databaseName'">
                <el-input v-model="field.databaseName" placeholder="请输入数据库名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="数据表名" :prop="'fieldContent.' + index + '.tableName'">
                <el-input v-model="field.tableName" placeholder="请输入数据表名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
            <el-form-item label="提供方ID" prop="'fieldContent.' + index+'.providerID'">
              <el-input v-model="field.providerID" placeholder="请输入提供方ID"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="4" class="delete-button-col">
              <el-button type="danger" @click="removeField(index)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <el-button @click="addField" type="primary">添加库表</el-button>

        <!-- 提交和重置按钮 -->
        <el-row>
          <el-col :span="24" class="button-row">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 数据展示部分 -->
    <el-card shadow="hover" class="data-table mt15">
      <el-row>
        <!-- 数据请求说明 -->
        <el-col :span="24">
          <div class="data-request">数据请求</div>
        </el-col>

        <!-- 刷新按钮 -->
        <el-col :span="24" class="refresh-button">
          <el-button type="primary" @click="loadTableData">刷新数据</el-button>
        </el-col>
        
        <!-- 展示列控制 -->
        <el-col :span="24" class="column-control">
          <el-tooltip content="选择展示列" placement="top">
            <el-dropdown>
              <el-button link>
                <el-icon><ele-Setting /></el-icon> 选择展示列
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-checkbox-group v-model="checkedColumns">
                    <el-dropdown-item>
                      <el-checkbox value="service_id">服务ID</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox value="serviceName">服务名</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox value="databaseName">数据库名称</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox value="tableName">数据表名称</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox value="requestStatus">请求状态</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox value="remarks">备注</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox value="operation">操作</el-checkbox>
                    </el-dropdown-item>
                  </el-checkbox-group>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-tooltip>
        </el-col>
      </el-row>

      <el-table :data="paginatedTableData" stripe>
        <!-- 通过条件渲染控制列显示 -->
        <el-table-column v-if="checkedColumns.includes('service_id')" prop="service_id" label="服务ID" width="150" />
        <el-table-column v-if="checkedColumns.includes('serviceName')" prop="service_name" label="服务名" width="200" />
        <el-table-column v-if="checkedColumns.includes('databaseName')" prop="db_name" label="数据库名称" width="200" />
        <el-table-column v-if="checkedColumns.includes('tableName')" prop="table_name" label="数据表名称" width="200" />
        <el-table-column v-if="checkedColumns.includes('requestStatus')" prop="status" label="请求状态" width="150" />
        <el-table-column v-if="checkedColumns.includes('remarks')" prop="remarks" label="备注" width="200" />
        <el-table-column v-if="checkedColumns.includes('operation')" label="操作" width="250">
          <template #default="scope">
            <div class="button-container">
              <el-button type="primary" class="operation-button" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="primary" class="operation-button" @click="handleView(scope.row)">查看</el-button>
              <el-button type="primary" class="action-button" @click="handleCreateTable(scope.row)" v-if="scope.row.status === 'agree'">建表</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        class="mt15"
        background
        layout="prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="dataDisplayState.tableData.length"
        @current-change="handlePageChange"
      />
    </el-card>

    <!-- 建表表单 -->
    <el-card shadow="hover" class="edit-form mt15" v-if="isEditing">
      <el-form :model="creatTableForm" ref="editFormRef" label-width="120px">
        <el-form-item label="服务ID" prop="service_id">
          <el-input v-model="creatTableForm.service_id" placeholder="请输入服务ID"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitCreat">提交</el-button>
          <el-button @click="cancelCreat">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script lang="ts">
import request from '/@/utils/request'
import { defineComponent, ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { NegotiationFormState, getDefaultNegotiationFormState, DataDisplayState, getDefaultDataDisplayState } from '/@/views/member/negotiation/component/model';
import { addNegotiation, listNegotiation } from '/@/api/member/negotiation';
import axios from 'axios';

export default defineComponent({
  name: 'NegotiationPage',
  components: {
  },
  setup() {
    // 表单状态
    const formState = ref<NegotiationFormState>(getDefaultNegotiationFormState());
    const formData = ref({
      serviceName: '',
      providerID: '',
      fieldContent: [] as { databaseName: string, tableName: string }[],
    });
        
    const rules = formState.value.rules;
    const negotiationForm = ref();

    // 数据展示状态
    const dataDisplayState = ref<DataDisplayState>(getDefaultDataDisplayState());

    const checkedColumns = ref<string[]>([
      'service_id',
      'serviceName',
      'databaseName',
      'tableName',
      'requestStatus',
      'remarks',
      'operation',
    ]);

    const addField = () => {
      formData.value.fieldContent.push({
        databaseName: '',
        tableName: '',
      });
    };

    const removeField = (index: number) => {
      formData.value.fieldContent.splice(index, 1);
    };

    // 建表按钮处理
    const handleCreateTable = (row: any) => {
      isEditing.value = true;
      creatTableForm.value = { ...row, secureTableField: [], reason: '' };
    };

    // 表单提交函数
    const submitForm = () => {
      negotiationForm.value.validate((valid: boolean) => {
        if (valid) {
          const dataToSend = {
            serviceName: formData.value.serviceName,
            providerID: formData.value.providerID,
            serviceOwnerID: 12,
            fieldContent: formData.value.fieldContent,
          };
          
          addNegotiation(dataToSend)
            .then((response) => {
              if (response.data.status === 'success') {
                ElMessage.success('提交成功');
                console.log('response', response);
                resetForm();
              } else {
                ElMessage.error('提交失败');
              }
            })
            .catch(() => {
              ElMessage.error('网络错误，请稍后重试');
            });
        } else {
          ElMessage.error('请完善表单信息');
        }
      });
    };

    // 重置表单函数
    const resetForm = () => {
      negotiationForm.value.resetFields();
      formState.value = getDefaultNegotiationFormState();
    };

    const handleEdit = (row: any) => {
      console.log('Edit', row);
    };

    const handleView = (row: any) => {
      
    };

    const isEditing = ref(false);
    const creatTableForm = ref({
      service_id: '',
    });

    const submitCreat = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}api/v1/system/handle/notify`, creatTableForm.value);
        ElMessage.success('提交成功');
        isEditing.value = false;
      } catch (error) {
        ElMessage.error('提交失败');
      }
    };

    // 取消创建
    const cancelCreat = () => {
      isEditing.value = false;
    };

    // 分页相关
    const currentPage = ref(1);
    const pageSize = ref(10);

    // 计算分页后的数据
    const paginatedTableData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return dataDisplayState.value.tableData.slice(start, end);
    });


    // 加载表格数据
    const loadTableData = () => {
      const query = {
        user_type:"owner",
        owner_id:12,
      }

      listNegotiation(query)
        .then((response) => {
          console.log('response', response);
          if (response.data.status === 'success') {
            ElMessage.success('接收成功');
            dataDisplayState.value.tableData = response.data.items;
          } else {
            ElMessage.error('获取数据失败');
          }
        })
        .catch(() => {
          ElMessage.error('网络错误，请稍后重试');
        });
    };

    // 分页处理
    const handlePageChange = (page: number) => {
      currentPage.value = page;
    };

    // 页面加载时调用加载数据
    onMounted(() => {
      //loadTableData();
    });

    return {
      formData,
      rules,
      negotiationForm,
      addField,
      removeField,
      dataDisplayState,
      checkedColumns,
      submitForm,
      resetForm,
      handleEdit,
      handleView,
      handleCreateTable,
      loadTableData,
      submitCreat,
      cancelCreat,
      isEditing,
      creatTableForm,
      paginatedTableData,
      currentPage,
      pageSize,
      handlePageChange
    };
  },
});
</script>

<style scoped>
.negotiation-container {
  margin: 20px;
}

.form-header {
  margin-bottom: 20px;
}

.data-table {
  margin-top: 15px;
}

.data-request {
  font-size: 16px;
  font-weight: bold;
}

.column-control {
  margin-bottom: 15px;
}

.button-row {
  margin-top: 10px;
}

.button-container {
  display: flex;
  gap: 10px; /* 添加按钮间的间距 */
}

.operation-button {
  background-color: #007bff; /* 蓝底 */
  color: white; /* 白字 */
  border: none; /* 去除边框 */
}

.operation-button:hover {
  background-color: #0056b3; /* 鼠标悬停时的颜色变化 */
}

/* 确保数据列不会换行显示 */
.el-table-column {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.field-row {
  margin-bottom: 20px; /* 调整每个字段行之间的垂直间距 */
}

.delete-button-col {
  display: flex;
  align-items: flex-end; /* 使删除按钮位于底部 */
}

/* 分页组件样式 */
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
</style>