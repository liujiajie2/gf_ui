// src/views/member/negotiation_provider/component/model.ts

// 定义用于管理数据的接口和状态
export interface ProviderFormState {
    formData: {
        serviceID: string;
        allowCreateTable: 'agree' | 'reject'; // 使用 'agree' 或 'reject'
        safeTableName: string;
    };
    rules: {
        [key: string]: any;
    };
    requestStatusColumnLabel: string; // 列标签
}

// 获取默认的表单状态
export function getDefaultProviderFormState(): ProviderFormState {
    return {
        formData: {
            serviceID: '',
            allowCreateTable: 'reject', // 默认值为 'reject'
            safeTableName: '',
        },
        rules: {
            serviceID: [{ required: true, message: '请输入服务ID', trigger: 'blur' }],
            allowCreateTable: [{ required: true, message: '请选择是否允许建表', trigger: 'change' }],
            safeTableName: [{ required: true, message: '请输入安全表名', trigger: 'blur' }],
        },
        requestStatusColumnLabel: '请求状态' // 默认值
    };
}

// 定义请求数据接口
export interface RequestData {
    databaseName: string;
    tableName: string;
    serviceName: string;
    providerID: string | null; // 服务方ID
}

// 定义响应数据接口
export interface ResponseData {
    serviceID: string;
    serviceName: string;
    databaseName: string;
    tableName: string;
    requestStatus: 'start' | 'agree' | 'reject'; // 请求状态
}
