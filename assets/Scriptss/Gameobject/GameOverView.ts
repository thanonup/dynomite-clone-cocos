import { _decorator, Collider2D, Component, Contact2DType, Graphics, UITransform } from 'cc'
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
        type: Collider2D,
    })
    public gameOverColiider: Collider2D

    public doInit() {
        console.log('Init GameOverView')
        this.gameplayPod = GameplayPod.instance

        this.gameoverLine.rect(
            -this.node.getComponent(UITransform).width / 2,
            0,
            this.node.getComponent(UITransform).width,
            5
        )
        this.gameoverLine.fill()

        this.gameOverColiider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        this.gameOverColiider.on(Contact2DType.END_CONTACT, this.onEndContact, this)

        this.gameplayPod.gameplayPodEventTarget.on('gameState', () => {
            this.colliders = []
        })
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.tag == 99) {
            if (this.gameplayPod.gameState != GameplayState.GameOver && !otherCollider.getComponent(EggView).isBullet) {
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
            this.colliders.filter((obj) => obj != otherCollider)

            if (this.colliders.length == 0) {
                clearTimeout(this.countdownTimeout)
                this.countdownTimeout = undefined
            }
        }
    }

    update(deltaTime: number) {}
}
