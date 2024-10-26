// 定义表单数据结构
export interface ExchangeForm {
    serviceID: number;   // 服务ID
    handleID: number;    // handleID
}

// 定义表格数据结构
export interface ExchangeTableData {
    handle_id: 0;   // handleid 
    service_id: 0;  // 服务id 
    service_name: string;     // 服务名
    provider_id: 0;  // 提供方id
}

// 定义初始表单数据
export function getDefaultExchangeForm(): ExchangeForm {
    return {
        serviceID: 0,
        handleID: 0
    };
}
