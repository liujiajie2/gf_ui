export interface NegotiationFormState {
    formData: {
        databaseName: string;
        tableName: string;
        serviceName: string;
        providerID: number | null; // 将类型改为 number | null
        serviceOwnerID: number | null;
    };
    rules: {
        [key: string]: any;
    };
}

// 获取默认的表单状态
export function getDefaultNegotiationFormState(): NegotiationFormState {
    return {
        formData: {
            databaseName: '',
            tableName: '',
            serviceName: '',
            providerID: null, // 初始化为 null
            serviceOwnerID: null,
        },
        rules: {
            databaseName: [{ required: true, message: '请输入数据库名', trigger: 'blur' }],
            tableName: [{ required: true, message: '请输入数据表名', trigger: 'blur' }],
            serviceName: [{ required: true, message: '请输入服务名', trigger: 'blur' }],
            providerID: [{ required: true, message: '请输入提供方ID', trigger: 'blur' }],
        },
    };
}

// 定义服务 ID 的数据结构
export const service_id = [
    { value: 1, label: '服务1' },
    { value: 2, label: '服务2' },
    // 更多选项
];