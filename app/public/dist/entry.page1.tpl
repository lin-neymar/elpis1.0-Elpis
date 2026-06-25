<!doctype html><html><head><meta charset="utf-8"><link href="/static/normalize.css" rel="stylesheet"/><link href="/static/logo.jpg" rel="icon" type="image/x-icon"/><title>{{name}}</title><script defer="defer" src="/dist/prod/js/entry.page1_8c194040.bundle.js"></script></head><body style="margin: 0;"><div id="root"></div><input id="env" value="{{env}}"><input id="options" value="{{options}}"></body><script>try{
        window.env=document.getElementById('env').value
        const options=document.getElementById('options').value
        window.options=JSON.parse(options)
    }catch(e){
        console.log(e)
    }</script></html>