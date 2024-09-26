//  src/api/member/negotiation_provide.ts


//由于我是基于gfast框架设计前端的，因此我需要针对这个页面设计一个接口文件，目前接口主要实现的功能是，接受需求方（后端）的数据（数据库名，数据表名，服务名，服务方ID），根据业务逻辑自动填充其他列信息展示到页面中。另外一个功能是，将输入框中的信息再传输给后端，请按照以下接口代码的规范，帮我针对这个新的页面设计一个新的接口文件：


import request from '/@/utils/request'

// 获取数据交换请求列表
export function listExchangeRequests(query: object) {
    return request({
        url: '/api/v1/exchange/request/list', // 模板中的URL
        method: 'get',
        params: query
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
