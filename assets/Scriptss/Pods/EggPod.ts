import { _decorator, Component, Node, EventTarget } from 'cc'
import { EggView } from '../Gameobject/EggView'
import { EggBean } from '../Bean/EggBean'
const { ccclass, property } = _decorator

@ccclass('EggPod')
export class EggPod {
    public eggList: Array<EggView> = new Array<EggView>()
    public bean: EggBean
    public beanEventTarget = new EventTarget()

    constructor() {
        this.beanEventTarget.on(
            'Change',
            (bean: EggBean) => {
                this.bean = bean
            },
            this
        )
    }

    public ChangeBean(bean: EggBean) {
        this.beanEventTarget.emit('Change', bean)
    }
}
