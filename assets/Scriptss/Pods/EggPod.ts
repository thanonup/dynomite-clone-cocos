import { _decorator, Component, Node, EventTarget } from 'cc'
import { EggView } from '../Gameobject/EggView'
import { EggBean } from '../Bean/EggBean'
const { ccclass, property } = _decorator

@ccclass('EggPod')
export class EggPod {
    public eggList: Array<EggView> = new Array<EggView>()
    public eggListInType: Array<EggView> = new Array<EggView>()

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

    public addEggToEggList(eggView: EggView) {
        // console.log('add')
        this.eggList.forEach((eggElement) => {
            eggView.eggPod.eggList.forEach((egg) => {
                if (!eggElement.eggPod.eggList.find((x) => x == egg)) {
                    eggElement.eggPod.eggList.push(egg)
                }
            })
        })
    }

    public removeEggFromEggList(eggView: EggView) {
        this.eggList.forEach((eggElement) => {
            if (eggElement != eggView) {
                const index = eggElement.eggPod.eggList.indexOf(eggView, 0)
                if (index > -1) eggElement.eggPod.eggList.splice(index, 1)
            }
        })
    }

    public addEggToEggListInType(eggView: EggView) {
        // console.log('add in type')
        this.eggListInType.forEach((eggElement) => {
            eggView.eggPod.eggListInType.forEach((egg) => {
                if (!eggElement.eggPod.eggListInType.find((x) => x == egg)) {
                    eggElement.eggPod.eggListInType.push(egg)
                }
            })
        })
    }
}
