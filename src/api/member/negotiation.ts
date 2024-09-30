import request from '/@/utils/request'

// 查询分类信息列表
export function listNegotiation(query: object) {
    return request({
        url: '/api/v1/system/handle/negotiationList', // 使用模板中的URL
        method: 'post',
        data: query
    });
}

// 新增分类信息
export function addNegotiation(data: object) {
    return request({
        url: '/api/v1/system/handle/negotiation', // 使用模板中的URL
        method: 'post',
        data: data
    });
}

// 查询分类信息详细
// export function getNegotiation(id: number) {
//     return request({
//         url: '/api/v1/demo/demoGenClass/get', // 使用模板中的URL
//         method: 'get',
//         params: {
//             id: id.toString()
//         }
//     });
// }



// 修改分类信息
// export function updateNegotiation(data: object) {
//     return request({
//         url: '/api/v1/demo/demoGenClass/edit', // 使用模板中的URL
//         method: 'put',
//         data: data
//     });
// }

// 删除分类信息
// export function delNegotiation(ids: number[]) {
//     return request({
//         url: '/api/v1/demo/demoGenClass/delete', // 使用模板中的URL
//         method: 'delete',
//         data: {
//             id: ids
//         }
//     });
// }
