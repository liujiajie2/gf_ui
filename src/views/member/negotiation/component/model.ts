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

export interface DataDisplayState {
    tableData: Array<{
        service_id: number;      // 服务ID, 对应后端的 service_id
        service_name: string;    // 服务名, 对应后端的 service_name
        db_name: string;   // 数据库名称, 对应后端的 db_name
        table_name: string;      // 数据表名称, 对应后端的 table_name
        status: string;   // 请求状态, 对应后端的 status
        remarks: string | null; // 备注（可以保留）
    }>;
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

// 获取默认的展示栏数据状态
export function getDefaultDataDisplayState(): DataDisplayState {
    return {
        tableData: [],
    };
}
