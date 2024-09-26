import request from '/@/utils/request';

// 传输前端输入信息到后端
export function submitExchangeData(data: object) {
    return request({
        url: '/api/v1/member/demoGen/list',  // 替换为你实际的后端接口
        method: 'post',
        data: data
    });
}

// 获取展示列信息
export function getExchangeTableData() {
    return request({
        url: '/api/v1/member/demoGen/list',  // 替换为实际后端接口
        method: 'get',
    });
}
