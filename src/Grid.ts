class Grid extends egret.Sprite{

    public grid;

    public constructor(x,y){
        super();
        this.createView(x,y);
    }

    //这个这个sprite上添加一个黑色的格子
    private createView(x,y):void {
        this.grid= new egret.Sprite();
        this.grid.graphics.beginFill(0x0F0F0F, 1);
        this.grid.graphics.drawRect(0, 0, 120, 160);
        this.grid.graphics.endFill();
        this.grid.width = 120;
        this.grid.height = 160;
        this.addChild(this.grid);
        this.grid.x=x;
        this.grid.y=y;
        this.grid.touchEnabled = true;


    }

}
