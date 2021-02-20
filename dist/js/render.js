;(function (root){
    //渲染图片
    function renderImg(src){
        root.blurImg(src);
        var img = document.querySelector('.songImg img');
        img.src = src;
    }
    //渲染音乐信息
    function renderInfo(info){
        // console.log(info);
        var musicName = document.querySelector('.songInfo').children;
        musicName[0].innerText = info.name;
        musicName[1].innerText = info.singer;
        musicName[2].innerText = info.album;
    }

    //渲染是否喜欢
    function renderIsLike(isLike){
        var lis = document.querySelectorAll('.control li');
        lis[0].className = isLike ? 'liking' : '';
    }



    root.render = function(data){
        renderImg(data.image);
        renderInfo(data);
        renderIsLike(data.isLike);
    }
})(window.player || (window.player = {}))