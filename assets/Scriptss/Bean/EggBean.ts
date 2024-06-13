import { _decorator, Component, Node, SpriteFrame } from 'cc'
const { ccclass, property } = _decorator

@ccclass('EggBean')
export class EggBean extends Component {
    @property({ type: SpriteFrame })
    spriteFrame: SpriteFrame

    @property({ type: String })
    eggName: String

    EggBean() {}
}
