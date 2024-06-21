import { _decorator, Component, Node, Quat, Tween, tween } from 'cc'
const { ccclass, property } = _decorator

@ccclass('LoaddingUIView')
export class LoaddingUIView extends Component {
    @property(Node)
    public loaddingNode: Node
    @property(Node)
    public loaddingSpriteNode: Node

    private loaddingTween: Tween<Node>

    public static Instance: LoaddingUIView = null

    protected onLoad(): void {
        LoaddingUIView.Instance = this
    }

    public showLoadding() {
        console.log('show loadding')
        this.loaddingNode.active = true
        this.loaddingTween = tween(this.loaddingSpriteNode).by(2, { angle: 360 }).repeatForever().start()
    }

    public hideLoadding() {
        console.log('hide loadding')
        this.loaddingNode.active = false
        this.loaddingSpriteNode.angle = 0
        this.loaddingTween.stop()
    }
}
