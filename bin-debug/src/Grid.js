var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid(x, y) {
        _super.call(this);
        this.createView(x, y);
    }
    //这个这个sprite上添加一个黑色的格子
    Grid.prototype.createView = function (x, y) {
        this.grid = new egret.Sprite();
        this.grid.graphics.beginFill(0x0F0F0F, 1);
        this.grid.graphics.drawRect(0, 0, 120, 160);
        this.grid.graphics.endFill();
        this.grid.width = 120;
        this.grid.height = 160;
        this.addChild(this.grid);
        this.grid.x = x;
        this.grid.y = y;
        this.grid.touchEnabled = true;
    };
    return Grid;
})(egret.Sprite);
Grid.prototype.__class__ = "Grid";
