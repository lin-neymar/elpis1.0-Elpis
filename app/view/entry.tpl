<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <link href="/static/normalize.css" rel="stylesheet" />
    <link href="/static/logo.jpg" rel="icon" type="image/x-icon" />
    <title>{{name}}</title>
</head>
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