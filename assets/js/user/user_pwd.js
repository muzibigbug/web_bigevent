var form = layui.form;
var layer = layui.layer;
form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    samePwd: function(value) {
        // 获取密码框中的值
        var oldPwd = $('input[name="oldPwd"]').val();
        if (oldPwd == value) {
            return "新旧密码不能相同！！"
        }
    },
    rePwd: function(value) {
        // 获取密码框中的值
        var newPwd = $('input[name="newPwd"]').val();
        if (newPwd != value) {
            return "两次密码不一致！！"
        }
    }
});

//监听提交
form.on('submit(form_edit_user_pwd)', function(data) {
    var { oldPwd, newPwd } = data.field;
    $.ajax({
        type: "POST",
        url: '/my/updatepwd',
        data: { oldPwd, newPwd },
        success: function(res) {
            if (!res.status) {
                layer.msg("密码更新成功!");
                $('.layui-form')[0].reset();
                // 重置密码
                // localStorage.removeItem('token');
                // window.location.href = '/login.html';
                return;
            }
            layer.msg("密码更失败!");

        }
    })
    return false;
});