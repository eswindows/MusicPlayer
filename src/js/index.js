;
(function ($, player) {
    function MusicPlayer(dom) {
        this.wrap = dom;
        this.dataList = []; //歌曲列表数组
        // this.now = 0; // 歌曲索引
        this.indexObj = null; // 索引值对象(用于切歌)
        this.rotateTimer = null; // 旋转定时
        this.curIndex = 0; // 当前播放歌曲的索引值
        this.list = null; // 列表切歌对象

        this.progress = player.progress.pro(); // 实例化一个进度条的组件
    }
    MusicPlayer.prototype = {
        init() {
            this.getDom();
            this.getData('../mock/data.json');
        },
        getDom() {
            this.record = document.querySelector('.songImg img');
            this.controlBtns = document.querySelectorAll('.control li');
        },
        getData(url) {
            var This = this;
            $.ajax({
                url: url,
                method: 'get',
                success: function (data) {
                    This.dataList = data;
                    This.listPlay();
                    This.indexObj = new player.controlIndex(data.length);
                    This.loadMusic(This.indexObj.index); // 加载音乐
                    This.musicControl(); // 添加音乐操作功能
                    This.dragProgress();
                },
                error: function (error) {
                    console.log('数据请求失败')
                }
            })
        },
        loadMusic(index) {
            var This = this;
            player.render(this.dataList[index]);
            player.music.load(this.dataList[index].audioSrc);

            this.progress.renderAllTime(this.dataList[index].duration);
            //播放音乐
            if (player.music.status === 'play') {
                player.music.play();
                this.controlBtns[2].className = 'playing';
                this.imgRotate(0); // 旋转图片

                this.progress.move(0); // 切歌时候需要让进度条跟着走
            }
            // console.log(this.list)
            this.list.changeSelect(index); // 切歌时改变样式

            this.curIndex = index; // 存储当前索引

            // 歌曲播放到头了要切歌
            player.music.end(function(){
                This.loadMusic(This.indexObj.next());
            })

        },
        //控制音乐(按钮组)
        musicControl() {
            var This = this;
            //点击上一首
            this.controlBtns[1].addEventListener('touchend', function () {
                player.music.status = 'play';
                // This.now--;
                This.loadMusic(This.indexObj.prev()); //上一首索引
            })
            //播放、暂停
            this.controlBtns[2].addEventListener('touchend', function () {
                if (player.music.status === 'play') { // 歌曲的状态为播放，点击后暂停
                    player.music.pause(); // 歌曲暂停
                    this.className = ''; // 按钮变成暂停状态
                    This.imgStop(); // 停止旋转图片

                    This.progress.stop(); // 让进度条停止
                } else {
                    player.music.play(); // 歌曲播放
                    this.className = 'playing';

                    var deg = This.record.dataset.rotate || 0; //加上一次的旋转角度，第一次时取不到0做容错处理
                    This.imgRotate(deg); // 旋转图片

                    This.progress.move(); // 让进度条走
                }
            })
            //点击下一首
            this.controlBtns[3].addEventListener('touchend', function () {
                player.music.status = 'play';
                // This.now++;
                This.loadMusic(This.indexObj.next()); // 下一首索引
            })
        },
        //唱片旋转
        imgRotate(deg) {
            var This = this;
            clearInterval(this.rotateTimer);
            this.rotateTimer = setInterval(function () {
                deg = +deg + 0.2;
                This.record.style.transform = 'rotate(' + deg + 'deg)';
                This.record.dataset.rotate = deg; // 把旋转的角度存到标签身上，为了暂停后继续播放能取到
            }, 1000 / 60)
        },
        // 暂停旋转
        imgStop() {
            clearInterval(this.rotateTimer);
        },
        //列表切歌
        listPlay() {
            var This = this;
            this.list = player.listControl(this.dataList, this.wrap);

            //列表按钮添加点击事件
            this.controlBtns[4].addEventListener('touchend', function () {
                This.list.slideUp(); //让列表显示
            })
            //歌曲列表添加事件
            this.list.musicList.forEach(function(item,index){
                item.addEventListener('touchend',function(){
                    //如果点击的是当前的那首歌，不做处理
                    if(this.curIndex == index){
                        return;
                    }
                    player.music.status = 'play'; // 歌曲变成播放状态
                    This.indexObj.index = index; // 索引值要更新
                    This.loadMusic(index);
                    This.list.slideDown();
                })
            })
        },

        dragProgress:function(){
            var This = this;
            var circle = player.progress.drag(document.querySelector('.circle'));

            circle.init();
            //按下圆点
            circle.start = function() {
                This.progress.stop(); // 按下圆点让进度条停止
            }

            // 拖拽圆点
            circle.move = function(per){
                This.progress.update(per);
            }

            // 抬起圆点

            circle.end = function(per){
                var curTime = per * This.dataList[This.indexObj.index].duration;
                player.music.playTo(curTime);
                player.music.play();

                This.progress.move(per);

                var deg = This.record.dataset.rotate || 0;
                This.imgRotate(deg); // 旋转图片
                This.controlBtns[2].className = 'playing';

                // 拖拽到最后一秒切歌
                // if(curTime == This.dataList[This.indexObj.index].duration){
                //     player.music.status = 'play';
                //     This.loadMusic(This.indexObj.next());
                // }
            }
        }
    }
    var MusicPlayer = new MusicPlayer(document.getElementById('wrap'));
    MusicPlayer.init();
})(window.Zepto, window.player)