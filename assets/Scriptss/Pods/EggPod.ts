import { _decorator, Component, Node, EventTarget } from 'cc'
import { EggView } from '../Gameobject/EggView'
import { EggBean } from '../Bean/EggBean'
const { ccclass, property } = _decorator

@ccclass('EggPod')
export class EggPod {
    public eggList: Array<EggView> = new Array<EggView>()
    public eggListInType: Array<EggView> = new Array<EggView>()
    public currentLine: number
    public isPlayingSoundDestroy: boolean = false

    public bean: EggBean
    public eventTarget = new EventTarget()
    public eggView: EggView

    constructor(eggView: EggView) {
        this.eggView = eggView
        this.eggList.push(eggView)
        this.eggListInType.push(eggView)

        this.eventTarget.on(
            'BeanChange',
            (bean: EggBean) => {
                this.bean = bean
            },
            this
        )

        this.eventTarget.on('EggListChange', (eggList: Array<EggView>) => {
            //dont do this
            // eggList.forEach((x) => {
            //     console.log(x.name)
            // })
        })
    }

    public findIsPlayingSoundDestroy(): boolean {
        return this.eggListInType.some((x) => x.eggPod.isPlayingSoundDestroy == true)
    }

    public ChangeBean(bean: EggBean, isOnGrid: boolean = true) {
        this.eventTarget.emit('BeanChange', bean, isOnGrid)
    }

    public addEggToEggList(eggView: EggView) {
        // console.log('add')
        this.eggList.forEach((eggElement) => {
            eggView.eggPod.eggList.forEach((egg) => {
                if (!eggElement.eggPod.eggList.find((x) => x == egg)) {
                    eggElement.eggPod.onAddEggList(egg)
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

    public resetPod() {
        this.isPlayingSoundDestroy = false

        this.eggList = []
        this.eggList.push(this.eggView)

        this.eggListInType = []
        this.eggListInType.push(this.eggView)
    }

    public onRemoveEggFromEggList(eggView: EggView) {
        const index = this.eggList.indexOf(eggView, 0)
        if (index > -1) this.eggList.splice(index, 1)
        // this.eventTarget.emit('EggListChange', this.eggList)
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
