<template>
  <div class="calculation-container">
    <div class="form-header">
      <h3>计算页面</h3>
    </div>

    <!-- 表单部分 -->
    <el-card shadow="hover">
      <el-form :model="formData" :rules="rules" ref="calculationForm" label-width="120px">
        <el-row>
          <!-- serviceID -->
          <el-col :span="24">
            <el-form-item label="服务ID" prop="serviceID">
              <el-input v-model="formData.serviceID" placeholder="请输入服务ID"></el-input>
            </el-form-item>
          </el-col>

          <!-- computeType -->
          <el-col :span="24">
            <el-form-item label="计算类型" prop="computeType">
              <el-input v-model="formData.computeType" placeholder="请输入计算类型"></el-input>
            </el-form-item>
          </el-col>

          <!-- handleID -->
          <el-col :span="24">
            <el-form-item label="handleID" prop="handleID">
              <el-input v-model="formData.handleID" placeholder="请输入handleID"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 计算方式 -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="计算方式">
              <el-button v-if="!criteriaList.length" @click="addCriteria">新增</el-button>
              <div v-for="(criteria, index) in criteriaList" :key="index" class="criteria-row">
                <el-col :span="24">
                  <el-form-item label="方式名">
                    <el-select v-model="criteria.fieldName" multiple placeholder="请选择方式名">
                      <el-option label="STARTTIME" value="STARTTIME"></el-option>
                      <el-option label="ENDTIME" value="ENDTIME"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="日期范围">
                    <el-date-picker
                      v-model="criteria.fieldValue"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 标识符 -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="标识符">
              <el-button v-if="!identifierList.length" @click="addIdentifier">新增</el-button>
              <div v-for="(identifier, index) in identifierList" :key="index" class="identifier-row">
                <el-col :span="24">
                  <el-form-item label="标识符名">
                    <el-select v-model="identifier.fieldName" multiple placeholder="请选择标识符名">
                      <el-option label="CUSTOMERID" value="CUSTOMERID"></el-option>
                      <el-option label="phonenumber" value="phonenumber"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="标识符值">
                    <el-button @click="addIdentifierValue(index)">新增</el-button>
                    <div v-for="(value, valueIndex) in identifier.fieldValue" :key="valueIndex" class="identifier-value-row">
                      <el-input v-for="(fieldName, fieldNameIndex) in identifier.fieldName" :key="fieldNameIndex" v-model="value[fieldNameIndex]" placeholder="请输入字段值"></el-input>
                    </div>
                  </el-form-item>
                </el-col>
              </div>
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

    <!-- 新增的查询按钮和结果显示 -->
    <el-card shadow="hover" class="mt15">
      <el-button type="primary" @click="queryResult">查询计算结果</el-button>
      <div v-if="resultValue" class="result-display">
        <p>ResultValue: {{ resultValue }}</p>
      </div>
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
          <el-button type="primary" @click="loadAllData">刷新数据</el-button>
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
                      <el-checkbox value="computeTaskID">计算任务ID</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox value="computeType">计算类型</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox value="serviceID">服务ID</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox value="HandleIDList">handleID列表</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox value="queryStartTime">查询开始时间</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox value="queryEndTime">查询结束时间</el-checkbox>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-checkbox value="providerID">提供者ID</el-checkbox>
                    </el-dropdown-item>
                  </el-checkbox-group>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-tooltip>
        </el-col>
      </el-row>

      <el-table :data="dataDisplayState.tableData" stripe>
        <!-- 通过条件渲染控制列显示 -->
        <el-table-column v-if="checkedColumns.includes('computeTaskID')" prop="computeTaskID" label="计算任务ID" width="150" />
        <el-table-column v-if="checkedColumns.includes('computeType')" prop="computeType" label="计算类型" width="200" />
        <el-table-column v-if="checkedColumns.includes('serviceID')" prop="serviceID" label="服务ID" width="200" />
        <el-table-column v-if="checkedColumns.includes('HandleIDList')" prop="HandleIDList" label="处理ID列表" width="200" />
        <el-table-column v-if="checkedColumns.includes('queryStartTime')" prop="queryStartTime" label="查询开始时间" width="200" />
        <el-table-column v-if="checkedColumns.includes('queryEndTime')" prop="queryEndTime" label="查询结束时间" width="200" />
        <el-table-column v-if="checkedColumns.includes('providerID')" prop="providerID" label="提供者ID" width="200" />
      </el-table>

      <!-- 分页组件 -->
      <el-pagination
        class="mt15"
        background
        layout="prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onActivated } from 'vue';
import { ElMessage } from 'element-plus';
import { CalculationForm, CalculationTableData } from './component/model';
import { sendRequest, TaskList } from '/@/api/member/calculate_reg';

export default defineComponent({
  name: 'CalculationPage',
  setup() {
    // 表单数据和验证规则
    const formData = ref<CalculationForm>({
      serviceID: 0,
      computeType: 0,
      handleID: 0,
      criteria: {
        fieldName: '',
        fieldValue: ''
      },
      identifier: {
        fieldName: '',
        fieldValue: []
      }
    });

    const rules = {
      serviceID: [{ required: true, message: '请输入服务ID', trigger: 'blur' }],
      computeType: [{ required: true, message: '请输入计算类型', trigger: 'blur' }],
      handleID: [{ required: true, message: '请输入处理ID', trigger: 'blur' }],
      'criteria.fieldName': [{ required: true, message: '请输入字段名', trigger: 'blur' }],
      'identifier.fieldName': [{ required: true, message: '请输入字段名', trigger: 'blur' }],
      'identifier.fieldValue': [{ required: true, message: '请输入字段值', trigger: 'blur' }]
    };

    const calculationForm = ref();

    // 动态添加的计算方式和标识符列表
    const criteriaList = ref<{ fieldName: string[]; fieldValue: [string, string] }[]>([]);
    const identifierList = ref<{ fieldName: string[]; fieldValue: string[][] }[]>([]);

    // 数据展示状态
    const dataDisplayState = ref<{ tableData: CalculationTableData[] }>({
      tableData: []
    });

    const checkedColumns = ref<string[]>([
      'computeTaskID',
      'computeType',
      'serviceID',
      'HandleIDList',
      'queryStartTime',
      'queryEndTime',
      'providerID',
      'operation',
    ]);

    // 固定的 TaskID
    const taskID = ref(BigInt(0));
    const resultValue = ref('');

    // WebSocket 连接
    const ws = ref<WebSocket | null>(null);

    // 分页相关变量
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);

    // 所有数据
    const allData = ref<CalculationTableData[]>([]);

    // 添加计算方式
    const addCriteria = () => {
      criteriaList.value.push({ fieldName: [], fieldValue: ['', ''] });
    };

    // 添加标识符
    const addIdentifier = () => {
      identifierList.value.push({ fieldName: [], fieldValue: [] });
    };

    // 添加标识符值
    const addIdentifierValue = (index: number) => {
      const fieldNameLength = identifierList.value[index].fieldName.length;
      identifierList.value[index].fieldValue.push(Array(fieldNameLength).fill(''));
    };

    // 表单提交函数
    const submitForm = () => {
      calculationForm.value.validate((valid: boolean) => {
        if (valid) {
          // 构建请求数据
          const requestData: CalculationForm = {
            serviceID: Number(formData.value.serviceID),
            computeType: Number(formData.value.computeType),
            handleID: Number(formData.value.handleID),
            criteria: {
              fieldName: criteriaList.value[0].fieldName.join(','),
              fieldValue: criteriaList.value[0].fieldValue.join(',')
            },
            identifier: {
              fieldName: identifierList.value[0].fieldName.join(','),
              fieldValue: identifierList.value[0].fieldValue
            }
          };

          // 发送请求
          console.log('Request Data:', requestData);
          sendRequest(requestData).then((response: { data: CalculationTableData[] }) => {
            console.log('data:', response.data);
            console.log('Response Data:', response);
            dataDisplayState.value.tableData = response.data;
            taskID.value = BigInt(response.data[0].computeTaskID);
            ElMessage.success('查询成功');
          })
        } else {
          ElMessage.error('请完善表单信息');
        }
      });
    };

    // 重置表单函数
    const resetForm = () => {
      calculationForm.value.resetFields();
      criteriaList.value = [];
      identifierList.value = [];
    };

    const handleEdit = (row: any) => {
      console.log('Edit', row);
    };

    const handleView = (row: any) => {
      console.log('View', row);
    };

    // 加载所有数据
    const loadAllData = () => {
      const query = {
        user_type: "owner",
        owner_id: 12,
      };

      TaskList(query)
        .then((response) => {
          if (response.data.status === 'success') {
            allData.value = response.data.data;
            total.value = allData.value.length;
            //currentPage.value = 1 ; // 重置页码为1
            loadTableData(currentPage.value); // 初始加载第一页数据
          } else {
            ElMessage.error('获取数据失败');
          }
        })
        .catch(() => {
          ElMessage.error('网络错误，请稍后重试');
        });
    };

    // 加载表格数据
    const loadTableData = (page = 1) => {
      const start = (page - 1) * pageSize.value;
      const end = start + pageSize.value;
      dataDisplayState.value.tableData = allData.value.slice(start, end);
    };

    // 查询计算结果
    const queryResult = () => {
      if (!ws.value) {
        ws.value = new WebSocket(`ws://localhost:8808/ws`);

        ws.value.onopen = () => {
          ElMessage.success('WebSocket 连接成功');
        };

        taskID.value = BigInt(1154272151252078612);
        ws.value.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.TaskID == taskID.value) {
            resultValue.value = message.ResultValue;
            ElMessage.success(`TaskID: ${message.TaskID}, ResultValue: ${message.ResultValue}`);
          }
        };

        ws.value.onclose = () => {
          ElMessage.info('WebSocket 连接关闭');
        };

        ws.value.onerror = (error) => {
          ElMessage.error('WebSocket 错误: ' + error);
        };
      }

      if (ws.value.readyState === WebSocket.OPEN) {
        ws.value.send(JSON.stringify({ taskID: taskID.value }));
      } else {
        ElMessage.error('WebSocket 连接未打开');
      }
    };

    // 处理分页变化
    const handlePageChange = (page: number) => {
      currentPage.value = page;
      loadTableData(page);
    };

    // 页面加载时调用加载数据
    onMounted(() => {
      loadAllData();
      //setInterval(() => loadAllData(), 5000); // 每5秒自动刷新一次
    });

    // 页面激活时调用加载数据
    onActivated(() => {
      loadAllData();
    });

    return {
      formData,
      rules,
      calculationForm,
      criteriaList,
      identifierList,
      dataDisplayState,
      checkedColumns,
      submitForm,
      resetForm,
      handleEdit,
      handleView,
      addCriteria,
      addIdentifier,
      addIdentifierValue,
      loadAllData,
      taskID,
      resultValue,
      queryResult,
      currentPage,
      pageSize,
      total,
      handlePageChange
    };
  },
});
</script>

<style scoped>
.calculation-container {
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
</style>