var form = layui.form;
var layer = layui.layer;
form.verify({
    nickname: function(value) {
        if (value.trim().length > 6) {
            return "用户昵称1~6个字符之间!"
        }
    }
});
initUserInfo();

// 重置表单的数据
$('#btnReset').on('click', function(e) {
    initUserInfo();
    // 阻止默认表单的重置行为
    e.preventDefault();
});
//监听提交
form.on('submit(form_edit_user)', function(data) {
    $.ajax({
        type: "POST",
        url: '/my/userinfo',
        data: data.field,
        success: function(res) {
            console.log(res);
            if (!res.status) {
                return layer.msg("更新用户信息成功!")
            }
            layer.msg("更新用户信息失败!");
            // 调用父页面中的方法,重新渲染用户的头像和用户信息
            window.parent.getUserInfo();
        }
    })
    return false;
});

function initUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('初始化用户信息失败！')
            }
            form.val('formUserInfo', res.data)

        },

    });
}