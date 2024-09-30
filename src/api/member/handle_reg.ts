import request from '/@/utils/request'

// 新增分类信息
export function registerHandleInfo(data: object) {
    return request({
        url: '/api/v1/system/handle/register',
        method: 'post',
        data: data
    })
}
