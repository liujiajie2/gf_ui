<template>
  <div class="negotiation-container">
    <div class="form-header">
      <h3>需求申请</h3>
    </div>

    <el-card shadow="hover">
      <!-- 表单部分 -->
      <el-form :model="formData" :rules="rules" ref="negotiationForm" label-width="120px">
        <el-row>
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

          <!-- 服务名 -->
          <el-col :span="24">
            <el-form-item label="服务名" prop="serviceName">
              <el-input v-model="formData.serviceName" placeholder="请输入服务名"></el-input>
            </el-form-item>
          </el-col>

          <!-- 提供方ID -->
          <el-col :span="24">
            <el-form-item label="提供方ID" prop="providerID">
              <el-input v-model="formData.providerID" placeholder="请输入提供方ID"></el-input>
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

    <!-- 数据展示部分 -->
    <el-card shadow="hover" class="data-table mt15">
      <el-row>
        <!-- 数据请求说明 -->
        <el-col :span="24">
          <div class="data-request">数据请求</div>
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
                      <el-checkbox value="serviceID">服务ID</el-checkbox>
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

      <el-table :data="tableData" stripe>
        <!-- 通过条件渲染控制列显示 -->
        <el-table-column v-if="checkedColumns.includes('serviceID')" prop="serviceID" label="服务ID" width="150" />
        <el-table-column v-if="checkedColumns.includes('serviceName')" prop="serviceName" label="服务名" width="200" />
        <el-table-column v-if="checkedColumns.includes('databaseName')" prop="databaseName" label="数据库名称" width="200" />
        <el-table-column v-if="checkedColumns.includes('tableName')" prop="tableName" label="数据表名称" width="200" />
        <el-table-column v-if="checkedColumns.includes('requestStatus')" prop="requestStatus" label="请求状态" width="150" />
        <el-table-column v-if="checkedColumns.includes('remarks')" prop="remarks" label="备注" width="200" />
        <el-table-column v-if="checkedColumns.includes('operation')" label="操作" width="250">
          <template #default="scope">
            <div class="button-container">
              <el-button type="primary" class="operation-button" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="primary" class="operation-button" @click="handleView(scope.row)">查看</el-button>
              <el-button type="primary" class="operation-button" @click="handleCreateTable(scope.row)">建表</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { NegotiationFormState, getDefaultNegotiationFormState } from '/@/views/member/negotiation/component/model';
import { addNegotiation,listNegotiation } from '/@/api/member/negotiation';
import service from '/@/utils/request';

export default defineComponent({
  name: 'NegotiationPage',
  setup() {
    const formState = ref(getDefaultNegotiationFormState());
    const formData = formState.value.formData;
    const rules = formState.value.rules;
    const negotiationForm = ref();
    const statusMessage = ref<string | null>(null);

    interface TableData {
      serviceID: string;
      serviceName: string;
      databaseName: string;
      tableName: string;
      requestStatus: string;
      remarks: string;
      operation: string;
    }
    
    const tableData = ref<TableData[]>([]);

    const checkedColumns = ref<string[]>([
      'serviceID',
      'serviceName',
      'databaseName',
      'tableName',
      'requestStatus',
      'remarks',
      'operation',
    ]);



        // 表单提交函数
    const submitForm = () => {
      negotiationForm.value.validate((valid: boolean) => {
        if (valid) {
          // 调用后端 API 提交表单数据
          console.log("表单数据:", formData); // 在调用 API 之前，先打印一下表单数据
          const dataToSend = {
            serviceName: formData.serviceName,
            providerID: formData.providerID,
            servideOwnerID: 0,
            databaseName: formData.databaseName,
            tableName: formData.tableName,
          }
          addNegotiation(dataToSend).then((response) => {
            console.log("response:", response.data.code);
            if (response.data.code === 200) {
              ElMessage.success('提交成功');
              tableData.value.push({
                serviceID: response.data.serviceID, // 假设返回了新增记录的ID
                serviceName: dataToSend.serviceName,
                databaseName: dataToSend.databaseName,
                tableName: dataToSend.tableName,
                requestStatus: 'start',
                remarks: '',
                operation: '',
              });
              resetForm(); // 重置表单
            } else {
              ElMessage.error('提交失败');
            }
          }).catch(() => {
            ElMessage.error('网络错误，请稍后重试');
          });
        } else {
          ElMessage.error('请完善表单信息');
        }
      });
    };


    // 重置表单函数
    const resetForm = () => {
      formState.value = getDefaultNegotiationFormState();
      statusMessage.value = null;
    };
    // const resetForm = () => {
    //   negotiationForm.value.resetFields();
    //   statusMessage.value = null;
    // };

    const handleEdit = (row: any) => {
      console.log('Edit', row);
    };

    const handleView = (row: any) => {
      console.log('View', row);
    };

    const handleCreateTable = (row: any) => {
      console.log('Create Table', row);
    };

       // 加载表格数据
    const loadTableData = () => {
      listNegotiation({}).then((response) => {
        if (response.data.code === 200) {
          tableData.value = response.data;
        } else {
          ElMessage.error('获取数据失败');
        }
      }).catch(() => {
        ElMessage.error('网络错误，请稍后重试');
      });
    };

    // 页面加载时调用加载数据
    onMounted(() => {
      loadTableData();
    });

    return {
      formData,
      rules,
      negotiationForm,
      statusMessage,
      tableData,
      checkedColumns,
      submitForm,
      resetForm,
      handleEdit,
      handleView,
      handleCreateTable,
     // loadTableData,
    };
  },
});
</script>

    <!-- // const submitForm = () => {
    //   negotiationForm.value.validate((valid: boolean) => {
    //     if (valid) {
    //       tableData.value.push({
    //         serviceID: `ID-${Date.now()}`,
    //         serviceName: formData.serviceName,
    //         databaseName: formData.databaseName,
    //         tableName: formData.tableName,
    //         requestStatus: 'start',
    //         remarks: '',
    //         operation: '',
    //       });

    //       statusMessage.value = `成功提交了服务：${formData.serviceName}，数据库：${formData.databaseName}`;
    //       ElMessage.success('提交成功');
    //     } else {
    //       ElMessage.error('请完善表单信息');
    //     }
    //   });
    // }; -->

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
</style>


