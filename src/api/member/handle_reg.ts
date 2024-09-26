import request from '/@/utils/request'

// 新增分类信息
export function registerHandleInfo(data: object) {
    return request({
        url: 'http://127.0.0.1:8808/api/v1/system/handle/register',
        method: 'post',
        data: data
    })
}
