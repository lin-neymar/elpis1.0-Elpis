<!DOCTYPE html>
<html>
<head>
    <title>{{name}}</title>
    <link href="/static/normalize.css" rel="stylesheet" />
    <link href="/static/logo.jpg" rel="icon" type="image/x-icon" />
</head>
<body style="color: red;">
    <h1>Page1</h1>
    <input id="env" value="{{env}}"></input>
    <input id="options" value="{{options}}"></input>
    <button onclick="handleClick()">发送请求</button>
</body>
<script src="https://cdn.bootcss.com/axios/0.18.0/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/js-md5@0.8.3/src/md5.min.js"></script>
<script type="text/javascript">
    try{
        window.env=document.getElementById('env').value
        const options=document.getElementById('options').value
        window.options=JSON.parse(options)
    }catch(e){
        console.log(e)
    }

    const handleClick=()=>{
        const signKey = 'hsdfs73jsds629hsds8vwwgwg8qi9'
        const st = Date.now()
        axios.request({
            method:'get',
            url:'/api/project/list',
            data: {page:1 , size:10},
            headers: {s_t: st, s_sign: md5(`${signKey}_${st}`)}
        })

        //axios.get('/api/project/list').then((res)=>{
        //    console.log(res)
        //})

        // 采用post来测试
        //axios.request({
        //    method:'post',
        //    url:'/api/project/list',
        //    data:{a:1, b:2, c:3}
        //})
    }
</script>
</html>