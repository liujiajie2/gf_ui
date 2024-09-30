import request from '/@/utils/request'

// 获取数据交换请求列表
export function listExchangeRequests(query: object) {
    return request({
        url: '/api/v1/system/handle/negotiationList', // 模板中的URL
        method: 'post',
    });
}

// 获取数据交换请求详细信息
export function getExchangeRequest(id: number) {
    return request({
        url: '/api/v1/exchange/request/detail', // 模板中的URL
        method: 'get',
        params: {
            id: id.toString()
        }
    });
}

// 提交新的数据交换请求
export function addExchangeRequest(data: object) {
    return request({
        url: '/api/v1/exchange/request/add', // 模板中的URL
        method: 'post',
        data: data
    });
}

// 更新数据交换请求状态（同意/拒绝）
export function updateExchangeRequestStatus(data: object) {
    return request({
        url: '/api/v1/exchange/request/status/update', // 模板中的URL
        method: 'put',
        data: data
    });
}

// 删除数据交换请求
export function deleteExchangeRequest(ids: number[]) {
    return request({
        url: '/api/v1/exchange/request/delete', // 模板中的URL
        method: 'delete',
        data: {
            id: ids
        }
    });
}
