import request from '/@/utils/request'

// 发送请求
export function sendRequest(params: object) {
    return request({
        url: '/api/v1/system/compute/sendRequest',
        method: 'post',
        params: params
    })
}


// 保存计算记录
export function TaskList(query: object) {
    return request({
        url: '/api/v1/system/compute/TaskList',
        method: 'post',
        data: query
    })
}
