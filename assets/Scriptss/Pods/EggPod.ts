import { _decorator, Component, Node, EventTarget } from 'cc'
import { EggView } from '../Gameobject/EggView'
import { EggBean } from '../Bean/EggBean'
const { ccclass, property } = _decorator

@ccclass('EggPod')
export class EggPod {
    public eggList: Array<EggView> = new Array<EggView>()
    public eggListInType: Array<EggView> = new Array<EggView>()

    public bean: EggBean
    public eventTarget = new EventTarget()

    constructor() {
        this.eventTarget.on(
            'BeanChange',
            (bean: EggBean) => {
                this.bean = bean
            },
            this
        )

        this.eventTarget.on('EggListChange', (eggList: Array<EggView>) => {
            eggList.forEach((x) => {
                console.log(x.name)
            })
        })
    }

    public ChangeBean(bean: EggBean) {
        this.eventTarget.emit('BeanChange', bean)
    }

    public addEggToEggList(eggView: EggView) {
        // console.log('add')
        this.eggList.forEach((eggElement) => {
            eggView.eggPod.eggList.forEach((egg) => {
                if (!eggElement.eggPod.eggList.find((x) => x == egg)) {
                    this.onAddEggList(eggView)
                }
            })
        })
    }

    public onAddEggList(eggView: EggView) {
        this.eggList.push(eggView)
        this.eventTarget.emit('EggListChange', this.eggList)
    }

    public removeEggFromEggList(eggView: EggView) {
        this.eggList.forEach((eggElement) => {
            if (eggElement != eggView) eggElement.eggPod.onRemoveEggFromEggList(eggView)
        })
    }

    public onRemoveEggFromEggList(eggView: EggView) {
        const index = this.eggList.indexOf(eggView, 0)
        if (index > -1) this.eggList.splice(index, 1)
        this.eventTarget.emit('EggListChange', this.eggList)
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
