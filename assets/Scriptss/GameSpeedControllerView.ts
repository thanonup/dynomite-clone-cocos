import { _decorator, BoxCollider2D, CCFloat, Collider2D, Component, Contact2DType, Node } from 'cc'
import { EggView } from './Gameobject/EggView'
import { GameplayPod } from './Pods/GameplayPod'
import { GameOverView } from './Gameobject/GameOverView'
const { ccclass, property } = _decorator

@ccclass('GameSpeedControllerView')
export class GameSpeedControllerView extends Component {
    @property({ type: BoxCollider2D })
    private idleAreaCollider: BoxCollider2D

    private gameOverCollider: BoxCollider2D
    private warningCollider: BoxCollider2D

    @property({ type: CCFloat })
    private idleSpeed = 10

    @property({ type: CCFloat })
    private warningSpeed = 5

    @property({ type: CCFloat })
    private overSpawnSpeed = 20

    @property([EggView])
    public eggInIdleZoneList: EggView[] = []
    @property([EggView])
    public eggInWarningZoneList: EggView[] = []
    @property([EggView])
    public eggInGameOverZoneList: EggView[] = []

    @property({ type: GameOverView })
    public gameOverView: GameOverView

    private gameplayPod: GameplayPod
    private inited: boolean

    public doInit() {
        console.log('Init GameSpeedController View')
        this.gameplayPod = GameplayPod.instance

        this.gameOverCollider = this.gameOverView.gameOverColiider
        this.warningCollider = this.gameOverView.warningColiider

        this.idleAreaCollider.on(Contact2DType.BEGIN_CONTACT, this.onIdleBeginContact, this)
        this.idleAreaCollider.on(Contact2DType.END_CONTACT, this.onIdleEndContact, this)
        this.gameOverCollider.on(Contact2DType.BEGIN_CONTACT, this.onGameOverBeginContact, this)
        this.gameOverCollider.on(Contact2DType.END_CONTACT, this.onGameOverEndContact, this)
        this.warningCollider.on(Contact2DType.BEGIN_CONTACT, this.onWarningBeginContact, this)
        this.warningCollider.on(Contact2DType.END_CONTACT, this.onWarningEndContact, this)

        this.gameplayPod.gameplayPodEventTarget.on('gameSpeed', (speed) => {
            console.log('Change GameSpeed ' + speed)
        })
        this.inited = true
    }

    private onWarningBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.tag == 99) {
            var egg = otherCollider.getComponent(EggView)
            if (!egg.isBullet) {
                this.eggInWarningZoneList.push(egg)
            }
        }
        this.onCollision()
    }

    private onWarningEndContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.tag == 99) {
            var egg = otherCollider.getComponent(EggView)
            if (!egg.isBullet) {
                const index = this.eggInWarningZoneList.indexOf(egg, 0)
                if (index > -1) this.eggInWarningZoneList.splice(index, 1)
            }
        }
        this.onCollision()
    }

    private onGameOverBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.tag == 99) {
            var egg = otherCollider.getComponent(EggView)
            if (!egg.isBullet) {
                this.eggInGameOverZoneList.push(egg)
            }
        }
        this.onCollision()
    }

    private onGameOverEndContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.tag == 99) {
            var egg = otherCollider.getComponent(EggView)
            if (!egg.isBullet) {
                const index = this.eggInGameOverZoneList.indexOf(egg, 0)
                if (index > -1) this.eggInGameOverZoneList.splice(index, 1)
            }
        }
        this.onCollision()
    }

    private onIdleBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.tag == 99) {
            var egg = otherCollider.getComponent(EggView)
            if (!egg.isBullet) {
                this.eggInIdleZoneList.push(egg)
            }
        }
        this.onCollision()
    }

    private onIdleEndContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.tag == 99) {
            var egg = otherCollider.getComponent(EggView)
            if (!egg.isBullet) {
                const index = this.eggInIdleZoneList.indexOf(egg, 0)
                if (index > -1) this.eggInIdleZoneList.splice(index, 1)
            }
        }

        this.onCollision()
    }

    update(deltaTime: number) {
        // if (!this.inited) return
        // if (this.eggInGameOverZoneList.length > 0) {
        //     if (this.gameplayPod.gameSpeed != 0) this.gameplayPod.gameplayPodEventTarget.emit('gameSpeed', 0)
        // } else if (this.eggInWarningZoneList.length > 0) {
        //     if (this.gameplayPod.gameSpeed != this.warningSpeed)
        //         this.gameplayPod.gameplayPodEventTarget.emit('gameSpeed', this.warningSpeed)
        // } else if (this.eggInIdleZoneList.length > 0) {
        //     if (this.gameplayPod.gameSpeed != this.idleSpeed)
        //         this.gameplayPod.gameplayPodEventTarget.emit('gameSpeed', this.idleSpeed)
        // } else if (this.eggInIdleZoneList.length < 1) {
        //     if (this.gameplayPod.gameSpeed != this.overSpawnSpeed)
        //         this.gameplayPod.gameplayPodEventTarget.emit('gameSpeed', this.overSpawnSpeed)
        // }
    }

    private onCollision() {
        if (this.eggInGameOverZoneList.length > 0) {
            if (this.gameplayPod.gameSpeed != 0) this.gameplayPod.gameplayPodEventTarget.emit('gameSpeed', 0)
        } else if (this.eggInWarningZoneList.length > 0) {
            if (this.gameplayPod.gameSpeed != this.warningSpeed)
                this.gameplayPod.gameplayPodEventTarget.emit('gameSpeed', this.warningSpeed)
        } else if (this.eggInIdleZoneList.length > 0) {
            if (this.gameplayPod.gameSpeed != this.idleSpeed)
                this.gameplayPod.gameplayPodEventTarget.emit('gameSpeed', this.idleSpeed)
        } else if (this.eggInIdleZoneList.length < 1) {
            if (this.gameplayPod.gameSpeed != this.overSpawnSpeed)
                this.gameplayPod.gameplayPodEventTarget.emit('gameSpeed', this.overSpawnSpeed)
        }
    }
}
