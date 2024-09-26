<template>
  <div class="provider-container">
    <div class="form-header">
      <h3>数据交换请求</h3>
    </div>

    <el-card shadow="hover">
      <!-- 数据展示部分 -->
      <el-row>
        <el-col :span="24">
          <!-- 展示列控制 -->
          <el-tooltip content="选择展示列" placement="top">
            <el-dropdown>
              <el-button type="text">
                <el-icon><ele-Setting /></el-icon> 选择展示列
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-checkbox-group v-model="checkedColumns">
                    <el-dropdown-item>
                      <el-checkbox label="serviceID">服务ID</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox label="serviceName">服务名</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox label="databaseName">数据库名称</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox label="tableName">数据表名称</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox label="requestStatus">请求状态</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox label="remarks">备注</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox label="operation">操作</el-checkbox>
                    </el-dropdown-item>
                  </el-checkbox-group>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-tooltip>
        </el-col>
      </el-row>

      <div class="table-wrapper">
        <el-table :data="tableData" stripe>
          <!-- 通过条件渲染控制列显示 -->
          <el-table-column v-if="checkedColumns.includes('serviceID')" prop="serviceID" label="服务ID" width="120" />
          <el-table-column v-if="checkedColumns.includes('serviceName')" prop="serviceName" label="服务名" width="150" />
          <el-table-column v-if="checkedColumns.includes('databaseName')" prop="databaseName" label="数据库名称" width="200" />
          <el-table-column v-if="checkedColumns.includes('tableName')" prop="tableName" label="数据表名称" width="200" />
          <el-table-column v-if="checkedColumns.includes('requestStatus')" prop="requestStatus" label="请求状态" width="150" />
          <el-table-column v-if="checkedColumns.includes('remarks')" prop="remarks" label="备注" width="200" />
          <el-table-column v-if="checkedColumns.includes('operation')" label="操作" min-width="300">
            <template #default="scope">
              <div class="action-buttons">
                <el-button type="primary" class="action-button" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="primary" class="action-button" @click="handleView(scope.row)">查看</el-button>
                <el-button type="primary" class="action-button" @click="handleCreateTable(scope.row)">建表</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 编辑按钮 -->
    <el-button type="primary" class="edit-button" @click="handleEditButtonClick">
      编辑
    </el-button>

    <!-- 编辑表单 -->
    <el-card shadow="hover" class="edit-form mt15" v-if="isEditing">
      <el-form :model="editForm" ref="editFormRef" label-width="120px">
        <el-form-item label="服务ID" prop="serviceID">
          <el-input v-model="editForm.serviceID" placeholder="请输入服务ID"></el-input>
        </el-form-item>
        <el-form-item label="是否允许建表" prop="allowCreateTable">
          <el-radio-group v-model="editForm.allowCreateTable">
            <el-radio label="同意">同意</el-radio>
            <el-radio label="不同意">不同意</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="安全表名" prop="secureTableName">
          <el-input v-model="editForm.secureTableName" placeholder="请输入安全表名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEdit">提交</el-button>
          <el-button @click="cancelEdit">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'ProviderPage',
  setup() {
    const tableData = ref([
      { serviceID: 'S001', serviceName: '服务A', databaseName: '数据库A', tableName: '表A', requestStatus: 'start', remarks: '备注A' },
      { serviceID: 'S002', serviceName: '服务B', databaseName: '数据库B', tableName: '表B', requestStatus: 'agree', remarks: '备注B' }
    ]);
    const isEditing = ref(false);
    const editForm = ref({
      serviceID: '',
      allowCreateTable: '同意',
      secureTableName: ''
    });
    const checkedColumns = ref([
      'serviceID',
      'serviceName',
      'databaseName',
      'tableName',
      'requestStatus',
      'remarks',
      'operation'
    ]);

    // 请求数据
    const fetchTableData = async () => {
      try {
        const response = await axios.get('/api/v1/provider/list');
        tableData.value = response.data;
      } catch (error) {
        ElMessage.error('获取数据失败');
      }
    };

    // 编辑按钮处理
    const handleEdit = (row: any) => {
      isEditing.value = true;
      editForm.value = { ...row };
    };

    // 点击编辑按钮
    const handleEditButtonClick = () => {
      isEditing.value = !isEditing.value;
    };

    // 提交编辑表单
    const submitEdit = async () => {
      try {
        await axios.put('/api/v1/provider/update', editForm.value);
        ElMessage.success('提交成功');
        isEditing.value = false;
        fetchTableData(); // 重新加载数据
      } catch (error) {
        ElMessage.error('提交失败');
      }
    };

    // 取消编辑
    const cancelEdit = () => {
      isEditing.value = false;
    };

    // 初始加载数据
    fetchTableData();

    return {
      tableData,
      isEditing,
      editForm,
      checkedColumns,
      handleEdit,
      handleEditButtonClick,
      submitEdit,
      cancelEdit
    };
  }
});
</script>

<style scoped>
.provider-container {
  padding: 20px;
  position: relative;
}

.edit-button {
  position: absolute;
  bottom: 20px;
  left: 20px;
}

.edit-form {
  margin-top: 20px;
}

.el-table th {
  background-color: #f5f5f5;
}

.el-table th, .el-table td {
  padding: 8px 10px;
}

.el-table th + th {
  border-left: 1px solid #fff;
}

/* 第一行的特定样式 */
.el-table thead tr th {
  background-color: #dcdcdc;
}

.el-input {
  width: 100%;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  gap: 10px; /* 调整按钮之间的间距 */
  justify-content: flex-start; /* 确保按钮靠左对齐 */
}

.action-button {
  background-color: #409EFF; /* 蓝底 */
  color: #fff; /* 白字 */
  border: none; /* 去掉默认边框 */
  border-radius: 4px; /* 可选的圆角 */
}

.table-wrapper {
  overflow-x: auto; /* 添加水平滚动条 */
}
</style>
