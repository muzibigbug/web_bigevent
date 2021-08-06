$(function() {
    // 调用用户的基本信息
    getUserInfo();
    var form = layui.form;
    var layer = layui.layer;
    // 退出
    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 1. 清空本地存储的token
            localStorage.removeItem('token');
            // 2. 重新跳转到登录页
            window.location.href = '/login.html'
            layer.close(index);
        });
    });
});
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // headers: { // 请求头配置对象(权限)，(抽离到全局 baseAPI.js)
        //     Authorization: localStorage.getItem("token") || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data);
        },
        // 无论成功还是失败都会调用这个函数,拿到服务器响应的数据, (抽离到全局 baseAPI.js)
        // complete: function(res) {
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message == '身份认证失败！') {
        //         // 1. 强制清空 token
        //         localStorage.removeItem('token');
        //         // 2. 强制跳转到登录页
        //         window.location.href = '/login.html';
        //     }
        // }
    })
};

// 渲染用户头像
function renderAvatar(user) {
    // 1. 获取用户的名称
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp' + name);
    // 2. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 文本头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 文本头像
        var first = name[0].toUpperCase();
        $('.layui-nav-img').hide();
        $('.text-avatar').html(first).show();
    }
}