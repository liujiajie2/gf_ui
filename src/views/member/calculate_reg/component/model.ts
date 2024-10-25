// 定义表单数据类型
export interface CalculationForm {
    serviceID: number;
    computeType: number;
    handleID: number;
    criteria: {
        fieldName: string;
        fieldValue: string;
    };
    identifier: {
        fieldName: string;
        fieldValue: string[][];
    };
}

// 定义表格展示数据类型
export interface CalculationTableData {
    computeTaskID: number;
    computeType: number;
    serviceID: number;
    providerID: number;
    HandleIDList: string;
    status: string;
    queryStartTime: string;
    queryEndTime: string;
}

// 定义表单提交返回响应数据类型
export interface ResponseData {
    taskID: number;
    status: string;
    message: string;
}
