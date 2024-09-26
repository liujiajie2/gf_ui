// model.ts

// 定义表单数据类型
export interface CalculationForm {
    serviceName: string;
    userCode: string;
    startTime: string;
    endTime: string;
}

// 定义表格展示数据类型
export interface CalculationTableData {
    serviceName: string;
    userCode: string;
    userName: string; // 新增字段
    startTime: string;
    endTime: string;
    electricityUsage: number; // 新增字段
}

// 获取默认表单数据
export function getDefaultCalculationForm(): CalculationForm {
    return {
        serviceName: '',
        userCode: '',
        startTime: '',
        endTime: ''
    };
}
