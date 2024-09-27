// // @/views/member/exchange_reg/component/model.ts

// // 定义表单数据结构
// export interface ExchangeForm {
//     serviceName: string;   // 服务名
//     providerName: string;  // 提供方名
//     handleName: string;    // handle名
//     databaseName: string;  // 数据库名
//     tableName: string;     // 数据表名
// }

// // 定义表格数据结构
// export interface ExchangeTableData {
//     serviceName: string;   // 服务名
//     providerName: string;  // 提供方名
//     tableName: string;     // 数据表名
//     exchangeResult: string;  // 交换结果，例如“成功”或“失败”
// }

// // 定义初始表单数据
// export function getDefaultExchangeForm(): ExchangeForm {
//     return {
//         serviceName: '',
//         providerName: '',
//         handleName: '',
//         databaseName: '',
//         tableName: ''
//     };
// }

// // 定义初始表格数据
// export function getDefaultTableData(): ExchangeTableData[] {
//     return [
//         {
//             serviceName: '服务1',
//             providerName: '提供方1',
//             tableName: '表1',
//             exchangeResult: '成功'
//         },
//         {
//             serviceName: '服务2',
//             providerName: '提供方2',
//             tableName: '表2',
//             exchangeResult: '失败'
//         }
//     ];
// }


// @/views/member/exchange_reg/component/model.ts

// 定义表单数据结构
export interface ExchangeForm {
    serviceID: number;   // 服务ID
}

// 定义表格数据结构
export interface ExchangeTableData {
    serviceName: string;   // 服务名
    providerName: string;  // 提供方名
    tableName: string;     // 数据表名
    exchangeResult: string;  // 交换结果，例如“成功”或“失败”
}

// 定义初始表单数据
export function getDefaultExchangeForm(): ExchangeForm {
    return {
        serviceID: 0,
    };
}
