import { SCREEN_WIDTH, SCREEN_HEIGHT } from './constants'
import { GameScene } from './scenes'
import { MenuScene } from './scenes'
import { BootScene } from './scenes'
// import { Plugin as NineSlicePlugin } from 'phaser3-nineslice'

const CONFIG: Phaser.Types.Core.GameConfig = {
    title: 'Tank War',
    version: '0.0.1',
    type: Phaser.AUTO,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    // zoom: 0.6,
    parent: 'game',
    scene: [BootScene, MenuScene, GameScene],
    input: {
        keyboard: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            // debug: true,
        },
    },
    backgroundColor: '#80BE1F',
    render: {
        antialias: true,
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    // plugins: {
    //     global: [NineSlicePlugin.DefaultCfg],
    // },
}

export default CONFIG
