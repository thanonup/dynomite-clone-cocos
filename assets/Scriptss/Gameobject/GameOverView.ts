import {
    _decorator,
    BoxCollider2D,
    CCFloat,
    Collider2D,
    Component,
    Contact2DType,
    Graphics,
    IPhysics2DContact,
    math,
    UITransform,
} from 'cc'
import { GameplayPod } from '../Pods/GameplayPod'
import { GameplayState } from '../States/GameplayState'
import { EggView } from './EggView'

const { ccclass, property } = _decorator

@ccclass('GameOverView')
export class GameOverView extends Component {
    @property({
        type: Graphics,
    })
    public gameoverLine: Graphics

    private gameplayPod: GameplayPod

    private colliders: Collider2D[] = []
    private countdownTimeout: number = undefined

    @property({
        type: BoxCollider2D,
    })
    public gameOverColiider: BoxCollider2D

    @property({ type: BoxCollider2D })
    public warningColiider: BoxCollider2D

    private isWarning: boolean = false

    private eggviewList: Array<EggView> = new Array<EggView>()

    public doInit() {
        console.log('Init GameOverView')
        //console.log('Color ' + this.gameoverLine.fillColor)

        this.gameplayPod = GameplayPod.instance

        this.gameoverLine.rect(
            -this.node.getComponent(UITransform).width / 2,
            0,
            this.node.getComponent(UITransform).width,
            5
        )
        this.gameoverLine.fill()
        this.defaultColor = this.gameoverLine.fillColor

        this.warningColiider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContactWarning, this)
        this.warningColiider.on(Contact2DType.END_CONTACT, this.onEndContactWarning, this)

        this.gameOverColiider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        this.gameOverColiider.on(Contact2DType.END_CONTACT, this.onEndContact, this)

        this.gameplayPod.gameplayPodEventTarget.on('gameState', () => {
            this.colliders = []
        })
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.tag == 99) {
            if (this.gameplayPod.gameState == GameplayState.GamePlay && !otherCollider.getComponent(EggView).isBullet) {
                this.colliders.push(otherCollider)

                if (this.countdownTimeout == undefined) {
                    this.countdownTimeout = setTimeout(
                        () => {
                            this.doOnCompleted()
                        },
                        3000,
                        this
                    )
                }
            }
        }
    }

    private doOnCompleted() {
        this.gameplayPod.gameplayPodEventTarget.emit('gameState', GameplayState.GameOver)
    }

    private onEndContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.tag == 99) {
            this.colliders = this.colliders.filter((obj) => obj != otherCollider)

            if (this.colliders.length == 0) {
                clearTimeout(this.countdownTimeout)
                this.countdownTimeout = undefined
            }
        }
    }

    onBeginContactWarning(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == 99) {
            var eggView = otherCollider.getComponent(EggView)

            if (eggView.isOnGrid && !this.eggviewList.find((x) => x == eggView)) {
                this.eggviewList.push(eggView)
            }
        }
    }

    onEndContactWarning(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == 99) {
            var eggView = otherCollider.getComponent(EggView)

            const index = this.eggviewList.indexOf(eggView, 0)
            if (index > -1) this.eggviewList.splice(index, 1)
        }
    }

    @property({ type: CCFloat })
    private fadeSpeed: number
    private count: number = 0
    private defaultColor

    update(deltaTime: number) {
        if (this.eggviewList.length > 0) {
            this.count += deltaTime * this.fadeSpeed
            var color: math.Color = this.gameoverLine.fillColor
            color.r = math.pingPong(this.count, 255)
            this.gameoverLine.fillColor = color
            this.gameoverLine.fill()
        } else {
            this.count = 0
            this.gameoverLine.fillColor = this.defaultColor
            this.gameoverLine.fill()
        }
    }
}
