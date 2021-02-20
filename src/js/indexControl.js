(function (root) {
    function Index(len) {
        this.index = 0;
        this.len = len;
    }

    Index.prototype = {
        // 获取上一个索引(上一首)
        prev() {
            return this.get(-1); // 切到上一首
        },

        //获取下一个索引(下一首)
        next() {
            return this.get(1); // 切到下一首
        },

        get(val) {
            this.index = (this.index + val + this.len) % this.len;
            return this.index;
        }
    }
    root.controlIndex = Index; // 把构造函数暴漏出去，因为实例对象需要传参所以不能直接暴漏实例对象
})(window.player || (window.player = {}))