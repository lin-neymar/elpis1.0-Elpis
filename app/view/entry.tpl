<!DOCTYPE html>
<html class="dark">
<head>
    <meta charset="utf-8">
    <link href="/static/normalize.css" rel="stylesheet" />
    <link href="/static/logo.jpg" rel="icon" type="image/x-icon" />
    <title>{{name}}</title>
</head>
<body style="margin: 0;">
    <div id="root"></div>
    <input type="hidden" id="env" value="{{ env }}" />
    <input type="hidden" id="options" value="{{ options }}" />
    <!-- 若要用服务端注入的项目： -->
    <input type="hidden" id="projKey" value="{{ projKey }}" />
</body>
<script type="text/javascript">
    try{
        window.projKey=document.getElementById('projKey').value
        window.env=document.getElementById('env').value
        const options=document.getElementById('options').value
        window.options=JSON.parse(options)
    }catch(e){
        console.log(e)
    }

    {# 
    <input type="hidden" id="env" value="{{ env }}" />
    <input type="hidden" id="options" value="{{ options }}" />
    <!-- 若要用服务端注入的项目： -->
    <input type="hidden" id="projKey" value="{{ projKey }}" />
    
    这三个隐藏域的作用是：把服务端在渲染 HTML 时算好的数据，塞进页面，再交给前端 JS 使用
    type="hidden"：在页面上不可见，只当「服务端 → 前端」的传值容器
     #}
</script>
</html>