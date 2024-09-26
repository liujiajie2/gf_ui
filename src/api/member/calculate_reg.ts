import request from '/@/utils/request'

// 查询计算结果
export function queryCalculationResult(params: object) {
    return request({
        url: '/api/v1/calculation/queryResult',
        method: 'get',
        params: params
    })
}

// 获取计算历史记录
export function getCalculationHistory() {
    return request({
        url: '/api/v1/calculation/history',
        method: 'get'
    })
}

// 保存计算记录
export function saveCalculationRecord(data: object) {
    return request({
        url: '/api/v1/calculation/saveRecord',
        method: 'post',
        data: data
    })
}
