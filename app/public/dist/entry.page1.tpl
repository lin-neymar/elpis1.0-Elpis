<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <link href="/static/normalize.css" rel="stylesheet" />
    <link href="/static/logo.jpg" rel="icon" type="image/x-icon" />
    <title>{{name}}</title>
<script defer src="http://127.0.0.1:9002/public/dist/dev/js/runtime~entry.page1_e13ffa1c.bundle.js"></script><script defer src="http://127.0.0.1:9002/public/dist/dev/js/vendor_d70d5861.bundle.js"></script><script defer src="http://127.0.0.1:9002/public/dist/dev/js/common_9ca6b40d.bundle.js"></script><script defer src="http://127.0.0.1:9002/public/dist/dev/js/entry.page1_3e6f8bad.bundle.js"></script></head>
<body style="margin: 0;">
    <div id="root"></div>
    <input id="env" value="{{env}}"></input>
    <input id="options" value="{{options}}"></input>
</body>
<script type="text/javascript">
    try{
        window.env=document.getElementById('env').value
        const options=document.getElementById('options').value
        window.options=JSON.parse(options)
    }catch(e){
        console.log(e)
    }
</script>
</html>