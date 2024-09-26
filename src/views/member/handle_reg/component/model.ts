import { reactive } from 'vue';

export interface KeyValueContent {
    keyValueName: string;
    originalTableName: string;
    secureTableName: string;
    fieldCount: number;
    fieldContent: FieldContent[];
    libName: string;
    funcName: string;
    garbleBitCount: number;
    garbleCoverType: number;
    garbleSaveField: GarbleSaveField[];
    garbleAlgorithm: string;
}

export interface FieldContent {
    fieldName: string;
}

export interface GarbleSaveField {
    fieldName: string;
    startByte: number;
    coverByte: number;
}

export interface RegistrationFormState {
    formData: {
        serviceName: string;
        serviceID: number;
        handleName: string;
        handleType: string;
        providerID: number;
        databaseName: string;
        keyValueCount: number;
        keyValueContent: KeyValueContent[];
    };
    rules: {
        [key: string]: any;
    };
    loading: boolean;
}

// 默认的表单数据和验证规则
export function getDefaultFormState(): RegistrationFormState {
    return {
        formData: {
            serviceName: '',
            serviceID: 0,
            handleName: '',
            handleType: '',
            providerID: 0,
            databaseName: '',
            keyValueCount: 0,
            keyValueContent: []
        },
        rules: {
            serviceName: [{ required: true, message: '请输入服务名', trigger: 'blur' }],
            serviceID: [{ required: true, type: 'number', message: '请输入服务ID', trigger: 'blur' }],
            handleName: [{ required: true, message: '请输入句柄名', trigger: 'blur' }],
            handleType: [{ required: true, message: '请输入句柄类型', trigger: 'blur' }],
            providerID: [{ required: true, type: 'number', message: '请输入提供方ID', trigger: 'blur' }],
            databaseName: [{ required: true, message: '请输入数据库名', trigger: 'blur' }],
            keyValueCount: [{ type: 'number', message: '键值对数量必须是数字', trigger: 'blur' }],
            keyValueContent: [
                { validator: validateKeyValueContent, trigger: 'blur' }
            ]
        },
        loading: false
    };
}

// 自定义验证函数
function validateKeyValueContent(rule: any, value: KeyValueContent[], callback: Function) {
    if (value.length === 0) {
        callback(new Error('请添加键值对内容'));
    } else {
        for (const item of value) {
            if (!item.keyValueName || !item.originalTableName || !item.secureTableName) {
                callback(new Error('键值对内容的必填字段不能为空'));
                return;
            }
        }
        callback();
    }
}
