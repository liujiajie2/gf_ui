<template>
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
    <el-form-item label="提供方ID" prop="providerID">
      <el-input type="number" v-model="formState.formData.providerID"></el-input>
    </el-form-item>
    <el-form-item label="数据库名" prop="databaseName">
      <el-input v-model="formState.formData.databaseName"></el-input>
    </el-form-item>

    <!-- 键值对内容部分 -->
    <div v-for="(keyValue, index) in formState.formData.keyValueContent" :key="index" class="key-value-section">
      <el-form-item label="乱码键值名" prop="keyValueName">
        <el-input v-model="keyValue.keyValueName"></el-input>
      </el-form-item>
      <el-form-item label="原始表名" prop="originalTableName">
        <el-input v-model="keyValue.originalTableName"></el-input>
      </el-form-item>
      <el-form-item label="脱敏表名" prop="secureTableName">
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
      <el-form-item label="数据库名" prop="libName">
        <el-input v-model="keyValue.libName"></el-input>
      </el-form-item>
      <el-form-item label="函数名" prop="funcName">
        <el-input v-model="keyValue.funcName"></el-input>
      </el-form-item>
      <el-form-item label="乱码位数" prop="garbleBitCount">
        <el-input type="number" v-model="keyValue.garbleBitCount"></el-input>
      </el-form-item>
      <el-form-item label="乱码覆盖类型" prop="garbleCoverType">
        <el-input type="number" v-model="keyValue.garbleCoverType"></el-input>
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
        <el-input v-model="keyValue.garbleAlgorithm"></el-input>
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
</template>

<script lang="ts">
import { defineComponent, reactive, ref ,onMounted,nextTick} from 'vue';
import { RegistrationFormState, getDefaultFormState } from '/@/views/member/handle_reg/component/model';
import { registerHandleInfo} from '/@/api/member/handle_reg';
import { ElForm } from 'element-plus';

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
        originalTableName: '',
        secureTableName: '',
        fieldCount: 0,
        fieldContent: [],
        libName: '',
        funcName: '',
        garbleBitCount: 0,
        garbleCoverType: 0,
        garbleSaveField: [],
        garbleAlgorithm: ''
      });
      // Update keyValueCount
      formState.formData.keyValueCount = formState.formData.keyValueContent.length;
    };

    const addFieldContent = (index: number) => {
      formState.formData.keyValueContent[index].fieldContent.push({
        fieldName: ''
      });
      // Update fieldCount
      formState.formData.keyValueContent[index].fieldCount = formState.formData.keyValueContent[index].fieldContent.length;
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
      addGarbleSaveField,
      submitForm,
      resetForm
    };
  },
});
</script>

<style scoped>
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
</style>
