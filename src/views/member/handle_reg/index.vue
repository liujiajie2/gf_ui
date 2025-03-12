<template>
  <div class="negotiation-container">
    <div class="form-header">
      <h3>服务注册</h3>
    </div>
    <el-card>
      <el-form ref = "formRef" v-model="formState.formData">
        <!-- 基本信息部分 -->
        <el-form-item label="服务名" prop="serviceName">
          <el-input v-model="formState.formData.serviceName"></el-input>
        </el-form-item>
        <el-form-item label="服务ID" prop="serviceID">
          <el-input type="number" v-model="formState.formData.serviceID"></el-input>
        </el-form-item>
        <el-form-item label="句柄名" prop="handleName">
          <el-input v-model="formState.formData.handleName"></el-input>
        </el-form-item>
        <el-form-item label="句柄类型" prop="handleType">
          <el-input v-model="formState.formData.handleType"></el-input>
        </el-form-item>

        <!-- 键值对内容部分 -->
        <div v-for="(keyValue, index) in formState.formData.keyValueContent" :key="index" class="key-value-section">
          <el-form-item label="提供方ID" prop="providerID">
            <el-input type="number" v-model="keyValue.providerID"></el-input>
          </el-form-item>
          <el-form-item label="数据库名" prop="databaseName">
            <el-input v-model="keyValue.databaseName"></el-input>
          </el-form-item>
          <el-form-item label="乱码键值名" prop="keyValueName">
            <el-input v-model="keyValue.keyValueName"></el-input>
          </el-form-item>
          <el-form-item label="安全存储表名" prop="secureTableName">
            <el-input v-model="keyValue.secureTableName"></el-input>
          </el-form-item>
          <el-form-item label="字段数量" prop="fieldCount">
            <el-input type="number" v-model="keyValue.fieldCount" readonly></el-input>
          </el-form-item>

          <!-- 新增字段内容 -->
          <div v-for="(field, fieldIndex) in keyValue.fieldContent" :key="fieldIndex" class="field-content-item">
            <el-form-item label="字段名" prop="fieldName">
              <el-input v-model="field.fieldName"></el-input>
            </el-form-item>
          </div>
          <el-button @click="addFieldContent(index)" type="primary" class="add-button">增加字段内容</el-button>

          <!-- 其他信息 -->
          <el-form-item label="拼接算法动态库名" prop="libName">
            <div class="addForm-input-wrapper">
              <el-select v-model="keyValue.libName" placeholder="拼接算法动态库名">
                <el-option label="libJHTMSticher.so" value="libJHTMSticher.so"></el-option>
                <el-option label="其他" value="Other"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="拼接算法函数名" prop="funcName">
            <div class="addForm-input-wrapper">
              <el-select v-model="keyValue.funcName" placeholder="拼接算法函数名">
                <el-option label="JHTM_sticher" value="JHTM_sticher"></el-option>
                <el-option label="其他" value="Other"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="乱码位数" prop="garbleBitCount">
            <div class="addForm-input-wrapper">
              <el-select v-model="keyValue.garbleBitCount" placeholder="乱码位数">
                <el-option label="8" value="8"></el-option>
                <el-option label="16" value="16"></el-option>
                <el-option label="24" value="24"></el-option>
                <el-option label="32" value="32"></el-option>
                <el-option label="64" value="64"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="乱码覆盖方式" prop="garbleCoverType">
            <div class="addForm-input-wrapper">
              <el-select v-model="keyValue.garbleCoverType" placeholder="乱码位数">
                <el-option label="1: 全覆盖,开始字节数与覆盖字节数默认为0" value="1"></el-option>
                <el-option label="2: 部分覆盖" value="2"></el-option>
                <el-option label="3: 拆分覆盖" value="3"></el-option>
              </el-select>
            </div>
          </el-form-item>
      
          <!-- 新增乱码保存字段 -->
          <el-form-item label="乱码保存字段">
            <div v-for="(garbleField, garbleIndex) in keyValue.garbleSaveField" :key="garbleIndex" class="garble-save-field-item">
              <el-form-item label="字段名" prop="fieldName">
                <el-input v-model="garbleField.fieldName"></el-input>
              </el-form-item>
              <el-form-item label="开始字节数" prop="startByte">
                <el-input type="number" v-model="garbleField.startByte"></el-input>
              </el-form-item>
              <el-form-item label="覆盖字节数" prop="coverByte">
                <el-input type="number" v-model="garbleField.coverByte"></el-input>
              </el-form-item>
            </div>
          </el-form-item>
          
          <!-- 增加乱码保存字段按钮 -->
          <el-button @click="addGarbleSaveField(index)" type="primary" class="add-button">增加乱码保存字段</el-button>

          <!-- 乱码算法 -->
          <el-form-item label="乱码算法" prop="garbleAlgorithm">
            <div class="addForm-input-wrapper">
              <el-select v-model="keyValue.garbleAlgorithm" placeholder="乱码算法">
                <el-option label="SM3" value="SM3"></el-option>
                <el-option label="其他" value="Other"></el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item label="原始表名" prop="originTableName">
            <el-input v-model="keyValue.originTableName"></el-input>
          </el-form-item>

          <!-- 原始表中字段内容 -->
          <el-form-item label="原始表中字段内容" prop="originFieldName">
            <div class="origin-field-tags">
              <!-- 显示已输入的标签 -->
              <el-tag
                v-for="(field, fieldIndex) in keyValue.originFieldName"
                :key="fieldIndex"
                closable
                @close="removeOriginField(index, fieldIndex)">
                {{ field }}
              </el-tag>
              
              <!-- 动态输入框 -->
              <el-input
                v-if="keyValue.originFieldInputVisible"
                v-model="keyValue.originFieldInputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter="addOriginField(index)"
                @blur="addOriginField(index)"
              />
              
              <!-- 显示新增按钮 -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showOriginFieldInput(index)">
                + 新增字段
              </el-button>
            </div>
          </el-form-item>

          <el-form-item label="原始表对应脱敏表名" prop="desenTableName">
            <el-input v-model="keyValue.desenTableName"></el-input>
          </el-form-item>

          <!-- 原始表中字段内容 -->
          <el-form-item label="脱敏表中字段内容" prop="desenFieldName">
            <div class="desen-field-tags">
              <!-- 显示已输入的标签 -->
              <el-tag
                v-for="(field, fieldIndex) in keyValue.desenFieldName"
                :key="fieldIndex"
                closable
                @close="removeDesenField(index, fieldIndex)">
                {{ field }}
              </el-tag>
              
              <!-- 动态输入框 -->
              <el-input
                v-if="keyValue.desenFieldInputVisible"
                v-model="keyValue.desenFieldInputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter="addDesenField(index)"
                @blur="addDesenField(index)"
              />
              
              <!-- 显示新增按钮 -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showDesenFieldInput(index)">
                + 新增字段
              </el-button>
            </div>
          </el-form-item>

          <el-form-item label="数据交换格式" prop="format">
            <el-input v-model="keyValue.format"></el-input>
          </el-form-item>

          <el-form-item label="数据交换协议" prop="protocol">
            <div class="addForm-input-wrapper">
              <el-select v-model="keyValue.protocol" placeholder="数据交换协议">
                <el-option label="1: 内部安全协议" value="1"></el-option>
                <el-option label="2: HTTP协议" value="2"></el-option>
              </el-select>
            </div>
          </el-form-item>

        </div>

        <!-- 增加键值对内容按钮 -->
        <el-form-item>
          <el-button @click="addKeyValueContent" type="primary" class="add-button">新增乱码</el-button>
        </el-form-item>

        <!-- 键值对数量显示框 -->
        <el-form-item label="乱码数量" prop="keyValueCount">
          <el-input type="number" v-model="formState.formData.keyValueCount" readonly style="background-color: #f5f5f5; color: #999;"></el-input>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" :loading="formState.loading" @click="submitForm">提交</el-button>
          <el-button type="warning" class = "custom-reset-button" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref ,onMounted,nextTick} from 'vue';
import { RegistrationFormState, getDefaultFormState } from '/@/views/member/handle_reg/component/model';
import { registerHandleInfo} from '/@/api/member/handle_reg';
import { ElForm, ElInput } from 'element-plus';

//const formRef = ref(null);


export default defineComponent({
  setup() {
    const formRef = ref<InstanceType<typeof ElForm> | null>(null);
    const formState = reactive<RegistrationFormState>(getDefaultFormState());
   
        // 使用 onMounted 钩子
    onMounted(() => {
      nextTick(() => {
          console.log('Form ref after mount:', formRef.value);
      });
      console.log('Form ref after mount:', formRef.value); // 确认 formRef 是否在组件挂载后被赋值
    });

    const addKeyValueContent = () => {
      formState.formData.keyValueContent.push({
        keyValueName: '',
        originTableName: '',
        secureTableName: '',
        fieldCount: 0,
        fieldContent: [],
        libName: '',
        funcName: '',
        garbleBitCount: 0,
        garbleCoverType: 0,
        garbleSaveField: [],
        garbleAlgorithm: '',
        format: 'JSON',
        originFieldName: [],
        originFieldInputVisible: false, // 新增输入框显示状态
        originFieldInputValue: '', // 新增输入框的值
        desenTableName: '',
        desenFieldName: [],
        protocol: 2,
        desenFieldInputVisible: false,
        desenFieldInputValue: ''
      });
      // Update keyValueCount
      formState.formData.keyValueCount = formState.formData.keyValueContent.length;
    };

    const showOriginFieldInput = (keyValueIndex: number) => {
      formState.formData.keyValueContent[keyValueIndex].originFieldInputVisible = true;
      // 自动聚焦输入框（需要确保ref正确）
      nextTick(() => {
      // 使用类型断言 `as HTMLInputElement`
        const inputRef = document.querySelector('.input-new-tag') as HTMLInputElement;
        if (inputRef) {
          inputRef.focus();
        }
      });
    };

    const addOriginField = (keyValueIndex: number) => {
      const inputValue = formState.formData.keyValueContent[keyValueIndex].originFieldInputValue.trim();
      if (inputValue) {
        formState.formData.keyValueContent[keyValueIndex].originFieldName.push(inputValue);
        formState.formData.keyValueContent[keyValueIndex].originFieldInputValue = '';
      }
      formState.formData.keyValueContent[keyValueIndex].originFieldInputVisible = false;
    };

    const removeOriginField = (keyValueIndex: number, fieldIndex: number) => {
      formState.formData.keyValueContent[keyValueIndex].originFieldName.splice(fieldIndex, 1);
    };

    const addFieldContent = (index: number) => {
      formState.formData.keyValueContent[index].fieldContent.push({
        fieldName: ''
      });
      // Update fieldCount
      formState.formData.keyValueContent[index].fieldCount = formState.formData.keyValueContent[index].fieldContent.length;
    };

    const showDesenFieldInput = (keyValueIndex: number) => {
      formState.formData.keyValueContent[keyValueIndex].desenFieldInputVisible = true;
      // 自动聚焦输入框（需要确保ref正确）
      nextTick(() => {
      // 使用类型断言 `as HTMLInputElement`
        const inputRef = document.querySelector('.input-new-tag') as HTMLInputElement;
        if (inputRef) {
          inputRef.focus();
        }
      });
    };

    const addDesenField = (keyValueIndex: number) => {
      const inputValue = formState.formData.keyValueContent[keyValueIndex].desenFieldInputValue.trim();
      if (inputValue) {
        formState.formData.keyValueContent[keyValueIndex].desenFieldName.push(inputValue);
        formState.formData.keyValueContent[keyValueIndex].desenFieldInputValue = '';
      }
      formState.formData.keyValueContent[keyValueIndex].desenFieldInputVisible = false;
    };

    const removeDesenField = (keyValueIndex: number, fieldIndex: number) => {
      formState.formData.keyValueContent[keyValueIndex].desenFieldName.splice(fieldIndex, 1);
    };

    const addGarbleSaveField = (index: number) => {
      formState.formData.keyValueContent[index].garbleSaveField.push({
        fieldName: '',
        startByte: 0,
        coverByte: 0
      });
    };

    // 提交表单 此处调用接口
    // const submitForm = async () => {
    //   formState.loading = true;
    //   try {
    //     if (formRef.value) {
    //       await formRef.value.validate();  // 验证表单
    //     } else {
    //       throw new Error('Form reference is null');
    //     }
    //     // 调用接口函数提交数据
    //     await registerHandleInfo(formState.formData);
    //     alert('提交成功');
    //   } catch (error) {
    //     alert('提交失败');
    //   } finally {
    //     formState.loading = false;
    //   }
    // };

  const submitForm = async () => {
    formState.loading = true;
    console.log('form:', formRef.value);
    try {
      // 检查 formRef 是否存在
      if (formRef.value) {
        console.log('表单开始验证');
        // 验证表单数据
        await formRef.value.validate(); 
        console.log('表单验证通过:', formState.formData);
      } else {
        throw new Error('Form reference is null');
      }

      // 打印要发送的数据
      console.log('提交的数据:', formState.formData);

      // 调用 API 提交数据
      const response = await registerHandleInfo(formState.formData);

      // 打印后端返回的数据
      console.log('提交成功，后端返回:', response);

      alert('提交成功');
    } catch (error) {
      // 打印错误信息
      console.error('提交失败，错误信息:', error);
      //alert(`提交失败: ${error.message}`);
    } finally {
      formState.loading = false;
    }
  };



    const resetForm = () => {
        Object.assign(formState.formData, getDefaultFormState().formData);
    };

    return {
      formRef,
      formState,
      addKeyValueContent,
      addFieldContent,
      showOriginFieldInput,
      addOriginField,
      removeOriginField,
      showDesenFieldInput,
      addDesenField,
      removeDesenField,
      addGarbleSaveField,
      submitForm,
      resetForm
    };
  },
});
</script>

<style scoped>
.negotiation-container {
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

.el-card {
  padding-top: 25px;
  padding-bottom: 25px;
  padding-left: 40px;
  padding-right: 40px;
}

.addForm-input-wrapper {
  width: 100%;
}

.key-value-section {
  border: 1px dashed #ccc;
  padding: 10px;
  margin-bottom: 20px;
}

.field-content-item {
  margin-bottom: 10px;
}

.garble-save-field-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.add-button {
  background-color: #007bff;
  color: #fff;
}

.el-form-item {
  margin-bottom: 10px;
}

.el-input[readonly] {
  background-color: #f5f5f5;
  color: #999;
}

.custom-reset-button {
    background-color: #f5f5f5;
    color :#007bff;
    border: 1px solid #007bff;
  margin-left: 10px;
}

.custom-reset-button:hover {
    background-color: #007bff;
    color: #fff;
}

.origin-field-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.el-tag {
  margin-right: 8px;
}

.input-new-tag {
  width: 120px;
}

.button-new-tag {
  margin-left: 8px;
}
</style>
