<template>
  <div class="provider-container">
    <div class="form-header">
      <h3>数据协商请求</h3>
    </div>

    <el-card shadow="hover" class="data-card">
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
                      <el-checkbox label="negotiation_id">协商ID</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox label="service_id">服务ID</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox label="service_name">服务名</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox label="db_name">数据库名称</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox label="table_name">数据表名称</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox label="status">请求状态</el-checkbox>
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
        <el-table :data="paginatedTableData" stripe>
          <!-- 通过条件渲染控制列显示 -->
          <el-table-column v-if="checkedColumns.includes('negotiation_id')" prop="negotiation_id" label="协商ID" width="120" />
          <el-table-column v-if="checkedColumns.includes('service_id')" prop="service_id" label="服务ID" width="120" />
          <el-table-column v-if="checkedColumns.includes('service_name')" prop="service_name" label="服务名" width="150" />
          <el-table-column v-if="checkedColumns.includes('db_name')" prop="db_name" label="数据库名称" width="200" />
          <el-table-column v-if="checkedColumns.includes('table_name')" prop="table_name" label="数据表名称" width="200" />
          <el-table-column v-if="checkedColumns.includes('status')" prop="status" label="请求状态" width="150" />
          <el-table-column v-if="checkedColumns.includes('remarks')" prop="remarks" label="备注" width="200" />
          <el-table-column v-if="checkedColumns.includes('operation')" label="操作" min-width="300">
            <template #default="scope">
              <div class="action-buttons">
                <el-button type="primary" class="action-button" @click="handleEdit(scope.row)">编辑</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
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

    <!-- 编辑按钮 -->
    <el-button type="primary" class="edit-button" @click="handleEditButtonClick">
      编辑
    </el-button>

    <!-- 编辑表单 -->
    <el-card shadow="hover" class="edit-form mt15" v-if="isEditing">
      <el-form :model="editForm" ref="editFormRef" label-width="120px">
        <el-form-item label="协商ID" prop="negotiation_id">
          <el-input v-model="editForm.negotiation_id" placeholder="请输入协商ID"></el-input>
        </el-form-item>
        <el-form-item label="服务ID" prop="service_id">
          <el-input v-model="editForm.service_id" placeholder="请输入服务ID"></el-input>
        </el-form-item>
        <el-form-item label="是否允许建表" prop="agree">
          <el-radio-group v-model="editForm.agree">
            <el-radio label="同意">同意</el-radio>
            <el-radio label="不同意">不同意</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="安全表名" prop="secureTableName">
          <el-input v-model="editForm.secureTableName" placeholder="请输入安全表名"></el-input>
        </el-form-item>

        <!-- 新增字段部分 -->
        <div  class="addForm" v-if="editForm.agree === '同意'">
          <el-form-item class="addForm-content" v-for="(field, index) in editForm.secureTableField" :key="index">
            <el-form-item label="字段名" prop="field.fieldName">
              <div class="addForm-input-wrapper">
                <el-input v-model="field.fieldName" placeholder="字段名"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="字段类型" prop="field.fieldType">
              <div class="addForm-input-wrapper">
                <el-input class="addForm-input" v-model="field.fieldType" placeholder="字段类型"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="是否为主键" prop="field.isKey">
              <div class="addForm-input-wrapper">
                <el-select v-model="field.isKey" label="是否为主键" placeholder="是否为主键">
                  <el-option label="是" value="true"></el-option>
                  <el-option label="否" value="false"></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="是否脱敏" prop="field.isSecret">
              <div class="addForm-input-wrapper">
                <el-select v-model="field.isSecret" placeholder="是否脱敏">
                  <el-option label="是" value="True"></el-option>
                  <el-option label="否" value="False"></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item v-if="field.isSecret === 'True'" label="脱敏后字段名" prop="field.fieldNameNew">
              <div class="addForm-input-wrapper">
                <el-input class="addForm-input" v-model="field.fieldNameNew" placeholder="脱敏后字段名"></el-input>
              </div>
            </el-form-item>
            <el-button type="danger" @click="removeField(index)">删除</el-button>
          </el-form-item>
          <el-button type="primary" @click="addField">新增字段</el-button>
        </div>

        <!-- 不同意理由 -->
        <div v-if="editForm.agree === '不同意'">
          <el-form-item label="不同意理由" prop="reason">
            <el-input v-model="editForm.reason" type="textarea" placeholder="请输入不同意理由"></el-input>
          </el-form-item>
        </div>

        <el-form-item>
          <el-button type="primary" @click="submitEdit">提交</el-button>
          <el-button @click="cancelEdit">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'ProviderPage',
  setup() {
    interface TableData {
      negotiation_id: string;
      service_id: string;
      service_name: string;
      db_name: string;
      table_name: string;
      status: string;
      remarks: string;
      operation: string;
    }
    
    const tableData = ref<TableData[]>([]);
    const isEditing = ref(false);
    const editForm = ref({
      negotiation_id: '',
      service_id: '',
      agree: '同意',
      secureTableName: '',
      secureTableField: [] as { fieldName: string, fieldType: string, isKey: string, isSecret: string, fieldNameNew: string }[],
      reason: ''
    });
    const checkedColumns = ref([
      'negotiation_id',
      'service_id',
      'service_name',
      'db_name',
      'table_name',
      'status',
      'remarks',
      'operation'
    ]);

    // 分页相关
    const currentPage = ref(1);
    const pageSize = ref(10);

    // 计算分页后的数据
    const paginatedTableData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return tableData.value.slice(start, end);
    });

    // 请求数据
    const fetchTableData = async () => {
      try {
        const defaultParams = {
            user_type: 'provider',
            provider_id: 1234
        };
        const response = await axios.post(`${import.meta.env.VITE_API_URL}api/v1/system/handle/negotiationList`, defaultParams);

        tableData.value = response.data.data.items;
      } catch (error) {
        ElMessage.error('获取数据失败');
        console.error(error);
      }
    };

    // 编辑按钮处理
    const handleEdit = (row: any) => {
      isEditing.value = true;
      editForm.value = { ...row, secureTableField: [], reason: '' };
    };

    // 点击编辑按钮
    const handleEditButtonClick = () => {
      isEditing.value = !isEditing.value;
    };

    // 提交编辑表单
    const submitEdit = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}api/v1/system/handle/negotiationAgree`, editForm.value);
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

    // 新增字段
    const addField = () => {
      editForm.value.secureTableField.push({
        fieldName: '',
        fieldType: '',
        isKey: '否',
        isSecret: '否',
        fieldNameNew: ''
      });
    };

    // 删除字段
    const removeField = (index: number) => {
      editForm.value.secureTableField.splice(index, 1);
    };

    // 分页处理
    const handlePageChange = (page: number) => {
      currentPage.value = page;
    };

    // 初始加载数据
    onMounted(() => {
      fetchTableData();
    });

    return {
      tableData,
      isEditing,
      editForm,
      checkedColumns,
      handleEdit,
      handleEditButtonClick,
      submitEdit,
      cancelEdit,
      addField,
      removeField,
      paginatedTableData,
      currentPage,
      pageSize,
      handlePageChange
    };
  }
});
</script>

<style scoped>
.addForm-input-wrapper {
  margin-bottom: 15px;
}

.provider-container {
  padding: 20px;
  position: relative;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.form-header {
  margin-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 10px;
}

.form-header h3 {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.data-card {
  min-height: 400px; /* 增加卡片的最小高度 */
}

.el-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-card__body {
  padding: 20px;
}

.el-table th {
  background-color: #f5f7fa;
  color: #303133;
  font-weight: 600;
}

.el-table th, .el-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #e4e7ed;
}

.el-table th + th {
  border-left: 1px solid #fff;
}

.el-table thead tr th {
  background-color: #dcdfe6;
}

.el-input, .el-select, .el-textarea {
  width: 100%;
  border-radius: 4px;
}

.el-input__inner {
  height: 32px;
  line-height: 32px;
}

.el-button {
  border-radius: 4px;
}

.el-button--primary {
  background-color: #409eff;
  border-color: #409eff;
}

.el-button--primary:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.el-button--danger {
  background-color: #f56c6c;
  border-color: #f56c6c;
  margin-left: 15px;
}

.el-button--danger:hover {
  background-color: #f78989;
  border-color: #f78989;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
}

.action-button {
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
}

.action-button:hover {
  background-color: #66b1ff;
}

.table-wrapper {
  overflow-x: auto;
  margin-top: 20px;
}

.edit-button {
  position: unset;
  margin-top: 20px;
  bottom: 20px;
  left: 20px;
  background-color: #409eff;
  border-color: #409eff;
}

.edit-button:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.edit-form {
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-form-item__label {
  color: #606266;
  font-weight: 600;
}

.el-form-item__content {
  margin-left: 120px;
}

.el-form-item__error {
  color: #f56c6c;
}

.el-radio-group {
  display: flex;
  gap: 20px;
}

.el-radio__label {
  color: #606266;
}

.el-radio__input.is-checked + .el-radio__label {
  color: #409eff;
}

.el-radio__input.is-checked .el-radio__inner {
  border-color: #409eff;
  background-color: #409eff;
}

.el-radio__inner:hover {
  border-color: #409eff;
}

.el-radio__inner {
  border-color: #dcdfe6;
}

.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.el-checkbox__label {
  color: #606266;
}

.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #409eff;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  border-color: #409eff;
  background-color: #409eff;
}

.el-checkbox__inner:hover {
  border-color: #409eff;
}

.el-checkbox__inner {
  border-color: #dcdfe6;
}

.el-dropdown-menu {
  border-radius: 4px;
}

.el-dropdown-menu__item {
  color: #606266;
}

.el-dropdown-menu__item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.el-tooltip__popper {
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-tooltip__popper .popper__arrow {
  border-color: #f5f7fa;
}

.el-tooltip__popper[x-placement^="top"] .popper__arrow {
  border-top-color: #f5f7fa;
}

.el-tooltip__popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #f5f7fa;
}

.el-tooltip__popper[x-placement^="left"] .popper__arrow {
  border-left-color: #f5f7fa;
}

.el-tooltip__popper[x-placement^="right"] .popper__arrow {
  border-right-color: #f5f7fa;
}

/* 新增字段部分的文本框大小调整 */
.el-form-item__content .el-input,
.el-form-item__content .el-select,
.el-form-item__content .el-textarea {
  width: 200px; /* 调整宽度 */
}

.el-form-item__content .el-input__wrapper {
  margin-bottom: 15px;
}


.el-form-item__content .el-input__inner {
  height: 32px; /* 调整高度 */
  line-height: 32px; /* 调整行高 */
}

.el-form-item__content .el-textarea__inner {
  height: 80px; /* 调整高度 */
}

/* 分页组件样式 */
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
</style>