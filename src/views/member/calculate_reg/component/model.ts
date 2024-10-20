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
    HandleIDList: string;
    queryStartTime: string;
    queryEndTime: string;
    providerID: number;
}