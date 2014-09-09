/**
 * Created by Administrator on 2014/8/22.
 */
class black_grid extends egret.DisplayObjectContainer {

    private static instance;

    private loadingView;

    private grid_array = [];
    private timer;
    private time_text;
    private time_account;
    private grid_account;
    private red_grid;
    private touchable;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    //这个类初始化后运行的函数
    private onAddToStage(event:egret.Event) {

        //便于取到到这个对象
        black_grid.instance = this;

        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.addChild(this.loadingView);

        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    }

    //配置文件加载完成,开始预加载资源组
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    }

    //资源组加载进度
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    //资源组加载完成
    private onResourceLoadComplete(event:RES.ResourceEvent):void {

        this.removeChild(this.loadingView);
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);

        //游戏开始
        this.start_game();


    }

    //游戏开始
    private start_game() {
        this.y=this.stage.stageHeight-800;

        this.grid_array = [];

        this.grid_account = 0;

        this.time_account = 1200;

        this.touchable = true;

        document.getElementById("shelter").style.display = "none";

        this.removeChildren();

        this.init_grid_array();

        this.my_drawRect();

        this.init_time_text();

        this.init_timer();

        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.on_stage_touch, this);
    }

    //游戏结束
    private game_over() {

        //修改title
        document.title = "我用30秒敲坏了" + this.grid_account + "个方块。防止变脑残！锻炼反应好方法,我要敲1000个！！！";

        //修改显示被锤的次数
        document.getElementsByTagName("span")[0].innerHTML = this.grid_account;
        document.getElementsByTagName("span")[1].innerHTML = this.grid_account;

        //显示遮挡层
        document.getElementById("shelter").style.display = "block";

        //点击重来一盘
        document.getElementById("start_btn").onclick = function () {
            black_grid.instance.start_game();
        }

    }

    //绘制网格
    private my_drawRect() {

        //画横线
        for (var i = 0; i < 6; i++) {
            var shp = new egret.Shape();
            shp.graphics.lineStyle(1, 0xcccccc);
            shp.graphics.moveTo(0, 160 * i);
            shp.graphics.lineTo(480, 160 * i);
            shp.graphics.endFill();
            this.addChild(shp);
        }

        //画竖线
        for (var i = 0; i < 5; i++) {
            var shp = new egret.Shape();
            shp.graphics.lineStyle(1, 0xcccccc);
            shp.graphics.moveTo(120 * i, 0);
            shp.graphics.lineTo(120 * i, 800);
            shp.graphics.endFill();
            this.addChild(shp);
        }
    }

    //初始化grid_array
    private init_grid_array() {

        this.grid_array = [];

        //添加gird到舞台和数组
        for (var i = 0; i < 4; i++) {

            var grid = new Grid(this.random_position().x, (3 - i) * 160);

            this.addChild(grid);

            this.grid_array.push(grid);

            grid.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.on_grid_touch, grid);

        }
    }

    //初始化timer计时器
    private init_timer() {

        //创建一个计时器对象
        this.timer = new egret.Timer(25, 0);
        //注册事件侦听器
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        //开始计时
        this.timer.start();

    }

    //初始化soap_account_text 文本
    private init_time_text() {
        this.time_text = new egret.TextField();
        this.time_text.y = 80;
        this.time_text.width = 475;
        this.time_text.textAlign = "center";
        this.time_text.textColor = 0x0099FF;
        this.time_text.size = 86;
        this.time_text.text = "30:00";
        this.addChild(this.time_text);
    }

    //点击格子触发的函数
    private on_grid_touch(event) {

        //todo 这里的intance是指这个类的对象，这里需要修改
        var instance = black_grid.instance;
        var grid_temp = this;

        if (grid_temp == instance.grid_array[0] && instance.touchable) {

            //得到的分数要增长
            instance.grid_account++;

            //被点gird消失
            egret.Tween.get(grid_temp).to({ alpha: 0 }, 100)
                .call(instance.grid_disappear_call, grid_temp);

            //新增一个
            var grid_mew = new Grid(instance.random_position().x, -160);
            instance.addChildAt(grid_mew, 0);
            grid_mew.addEventListener(egret.TouchEvent.TOUCH_BEGIN, instance.on_grid_touch, grid_mew);

            //将新添加的push到数组尾部
            instance.grid_array.push(grid_mew);

            //删除掉第一个
            instance.grid_array.splice(0, 1);

            //所有的gird下落
            for (var i = 0; i < instance.grid_array.length; i++) {
                var grid_temp_0 = instance.grid_array[i];
                egret.Tween.get(grid_temp_0)
                    .to({ y: grid_temp_0.y + 160 }, 100);
            }

        }

        return false;
    }

    //stage 被点击时触发的方法
    private on_stage_touch(event) {

        if (event.target.__class__ == "egret.Sprite")
            return false;


        if (this.touchable) {
            this.red_grid = new egret.Sprite();
            this.red_grid.graphics.beginFill(0xcd0000, 1);
            this.red_grid.graphics.drawRect(0, 0, 120, 160);
            this.red_grid.graphics.endFill();
            this.red_grid.width = 120;
            this.red_grid.height = 160;
            this.addChild(this.red_grid);
            this.red_grid.x = this.get_position_recently(event.stageX, event.stageY).x;
            this.red_grid.y = this.get_position_recently(event.stageX, event.stageY).y;
            this.touchable = false;

            //红格子动画
            egret.Tween.get(this.red_grid)
                .to({ alpha: 0 }, 300).to({ alpha: 1 }, 300)
                .to({ alpha: 0 }, 300).to({ alpha: 1 }, 300)
                .call(this.red_grid_call, this);

            //计时器要停止
            this.timer.stop();

        }
    }

    //格子消失掉的函数.从数组中移除，从舞台上移除。
    private grid_disappear_call() {

        var instance = black_grid.instance;
        var grid_temp = this;

        instance.removeChild(grid_temp);
    }

    //红格子闪完之后调用的函数
    private red_grid_call() {
        this.game_over();
    }

    //计数器循环触发的函数
    private timerFunc() {

        if (this.timer._currentCount == 1)
            alert("点击最下方黑色方块，开始指尖舞蹈");

        this.time_account--;

        this.time_text.text = this.format_time(this.time_account * 25);

        //游戏时间到了
        if (this.time_account == -1) {
            this.game_over();
            //计时器要停止
            this.timer.stop();
            this.time_text.text = "00:00";
        }

        //最后5秒时间变红色
        if (this.time_account == 200) {
            this.time_text.textColor = 0xcd0000;
        }
    }

    //修正时间显示格式
    private format_time(time) {

        var second:number = Math.floor(time / 1000);
        var second_str:string = second + "";
        if (second < 10) {
            second_str = "0" + second;
        }


        var millisecond = Math.floor(time % 1000);
        var millisecond_str:string = millisecond + "";
        if (millisecond >= 100) {
            millisecond_str = Math.floor(millisecond / 10) + "";
        }
        else if (millisecond < 10) {
            millisecond_str = "0" + millisecond;
        }


        return second_str + ":" + millisecond_str;

    }

    //返回一个随机位置对象
    private random_position() {

        //生成一个随机0到19的随机数
        var random = Math.floor(Math.random() * 20);

        var x = random % 4 * 120;
        var y = Math.floor(random / 5) * 160;

        return {x: x, y: y};
    }

    //传一个坐标值 返回最近 符合规定的坐标点
    private get_position_recently(x, y) {

        var recent_x = Math.floor(x / 120) * 120;
        var recent_y = Math.floor(y / 160) * 160;

        return {x: recent_x, y: recent_y};
    }
}