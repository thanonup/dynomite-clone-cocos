import { SpriteFrame, resources } from 'cc'

export class AssetManagerManual {
    public assetSpriteFrameCache

    private static _instance: AssetManagerManual

    private static getInstance() {
        if (!AssetManagerManual._instance) {
            AssetManagerManual._instance = new AssetManagerManual()
        }

        return AssetManagerManual._instance
    }

    static get instance(): AssetManagerManual {
        return this.getInstance()
    }

    public async loadSpriteFrameData(assets) {
        this.assetSpriteFrameCache = {}

        return new Promise<string>((resolve, reject) => {
            assets.forEach((x, index) => {
                resources.load(x.path, SpriteFrame, (err, spriteFrame) => {
                    if (err) {
                        reject(`Failed to load asset ${x.key}:`)

                        return
                    }

                    this.assetSpriteFrameCache[x.key] = spriteFrame
                    // console.log(`Asset ${x.key} loaded and cached.`)

                    if (index == assets.length - 1) resolve('done')
                })
            })
        })
    }

    public getAsset(key: string): SpriteFrame {
        return this.assetSpriteFrameCache[key]
    }
}
