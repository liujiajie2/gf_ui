import request from '/@/utils/request'

// 发送请求
export function sendRequset(params: object) {
    return request({
        url: '/api/v1/system/compute/sendRequest',
        method: 'post',
        params: params
    })
}


// 保存计算记录
export function TaskList(data: object) {
    return request({
        url: '/api/v1/system/compute/TaskList',
        method: 'post',
        data: data
    })
}
