$(function() {
    // 点击 去注册链接
    $('#link_reg').on('click', function() {
        $(this).closest('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击去登录链接
    $('#link_login').on('click', function() {
        $(this).closest('.reg-box').hide();
        $('.login-box').show();
    });

    // 从layui中获取form
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        // 自定义了一个叫pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) { // 校验两次密码是否一致的规则
            // 获取密码框中的值
            var pwd = $('.reg-box input[name="password"]').val();
            if (pwd != value) {
                return "两次密码不一致！！"
            }
        }
    });
    // 监听提交   注册   已注册lplp/111111
    form.on('submit(form_reg)', function(data) {
        var { username, password } = data.field;
        $.ajax({
            type: "POST",
            url: "/api/reguser",
            data: { username, password },
            success: function(res) {
                if (!res.status) {
                    $('.reg-box').hide();
                    $('.login-box').show();
                    return layer.msg('注册成功，请登录！', { icon: 1 });
                } else {
                    return layer.msg('注册失败，请更换其他用户！', { icon: 5 });
                }
            }
        })
        return false;
    });
    // //监听提交   登录
    form.on('submit(form_login)', function(data) {
        var { username, password } = data.field;
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: { username, password },
            success: function(res) {
                if (!res.status) {
                    // 将登录成功得到的token，存在localStorage中
                    localStorage.setItem('token', res.token);
                    return layer.msg('登录成功！', { icon: 1 }, function() {
                        // 登录成功后跳转到首页
                        window.location.href = '/index.html';
                    });
                } else {
                    return layer.msg('登录失败，用户不存在，请先注册！', { icon: 5 });
                }
            }
        })
        return false;
    });
})