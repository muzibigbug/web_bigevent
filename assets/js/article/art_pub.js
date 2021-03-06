$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 获取文章类别
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("初始化文章分类失败！");
                }
                // 调用模板引擎，渲染分类的下拉
                var htmlStr = template('tpl-cate', res);
                $('select[name="cate_id"]').html(htmlStr);
                // 动态插入表单一定要调用 form.render() 方法
                form.render();
            }
        })
    };

    // 初始化富文本编辑器
    initEditor();


    // 1. 初始化图片裁剪器
    var $image = $('#image');
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    // 3. 初始化裁减区域
    $image.cropper(options);

    // 点击选择按钮，触发file表单
    $('#btnChooseImage').click(function() {
        $('#coverFile').click();
    });
    $('#coverFile').on('change', function(e) {
        // 获取用户选择的文件
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg("请选择照片!!")
        };
        // 1.拿到用户选择的文件对象
        var file = e.target.files[0];
        // 2.根据选择的文件,创建一个对应的URL地址
        var newImgURL = URL.createObjectURL(file);
        // 3.为裁剪区域重新初始化图片路径
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    // 定义文章的发布状态
    var art_state = "已发布";
    // 监听提交   f发布
    form.on('submit(form_pub)', function(data) {
        var formData = {};
        // 4.将封面裁剪后的图片，输出为一个文件对象
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                var { title, cate_id } = data.field;
                var formData = new FormData();
                formData.set("title", title);
                formData.set("cate_id", cate_id);
                formData.set("content", tinymce.get('elm1').getContent());
                formData.set("state", art_state);
                // 将文本存储到 formData 中
                formData.set("cover_img", blob);
                // console.log(formData.get('cover_img'));
                // 发送ajax数据请求
                publishArticle(formData);
            }, 'image/jpeg');

        return false;
    });

    function publishArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！');
                // 发布文章成功后，跳转到文章列表页面
                // location.href = '/article/art_list.html';
            }
        })
    }
})