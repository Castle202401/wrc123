/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon="\uf1b2"
namespace LocationEvents {
    // イベントが発生したかどうかを管理する変数
    let triggeredEvents: { [key: string]: boolean } = {}

    //% block="プレイヤーと目標地点の距離をチェック"
    export function checkPlayerLocation(target: Block) {
         // チェックする相対座標の配列
        const positions = [
            pos(-1, 0, -1), pos(-1, 0, 0), pos(-1, 0, 1),
            pos(0, 0, -1),  pos(0, 0, 0),  pos(0, 0, 1),
            pos(1, 0, -1), pos(1, 0, 0), pos(1, 0, 1)
        ]
    
        // 配列の各位置でブロックをチェック
        for (let pos of positions) {
            if (blocks.testForBlock(target, pos)) {
                return true
            }
        }
    
        return false
    }

    //% block="宝箱イベントを開始する"
    export function startTreasureEvent() {
        // 宝箱の位置を設定
        const chestX = 10
        const chestY = 0
        const chestZ = 10
        const target = CHEST

        // 宝箱を設置
        blocks.place(target, pos(chestX, chestY, chestZ))

        // 宝箱の周りにヒントを表示
        player.say("宝箱を探せ！")
        player.say("ヒント: 北東方向にあるよ")

        // 定期的に位置をチェック
        loops.forever(function () {
            if (checkPlayerLocation(target)) {
                if (!triggeredEvents["treasure"]) {
                    triggeredEvents["treasure"] = true
                    player.say("宝箱を発見！")
                    mobs.spawnParticle(EXPLOSION_HUGE, pos(0, 0, 0))
                }
            }
        })
    }

    //% block="迷路イベントを開始する"
    export function startMazeEvent() {
        // 迷路のゴール位置を設定
        const goalX = 20
        const goalY = 0
        const goalZ = 20
        const target = STONE

        // 迷路の壁を生成
        for (let i = 0; i < 5; i++) {
            blocks.place(STONE, pos(goalX + i, goalY, goalZ))
        }

        player.say("迷路のゴールを目指せ！")

        // 定期的に位置をチェック
        loops.forever(function () {
            if (checkPlayerLocation(target)) {
                if (!triggeredEvents["maze"]) {
                    triggeredEvents["maze"] = true
                    player.say("迷路クリア！")
                    mobs.spawnParticle(EXPLOSION_HUGE, pos(0, 0, 0))
                }
            }
        })
    }

    //% block="隠しアイテムイベントを開始する"
    export function startHiddenItemEvent() {
        // 隠しアイテムの位置を設定
        const itemX = 30
        const itemY = 0
        const itemZ = 30
        const target = EMERALD_BLOCK

        // 隠しアイテムを設置
        blocks.place(target, pos(itemX, itemY, itemZ))

        player.say("隠されたエメラルドを探せ！")

        // 定期的に位置をチェック
        loops.forever(function () {
            if (checkPlayerLocation(target)) {
                if (!triggeredEvents["hiddenItem"]) {
                    triggeredEvents["hiddenItem"] = true
                    player.say("エメラルドを発見！")
                    mobs.spawnParticle(EXPLOSION_HUGE, pos(0, 0, 0))
                }
            }
        })
    }

    //% block="イベントをリセットする"
    export function resetEvents() {
        triggeredEvents = {}
        player.say("すべてのイベントをリセットしました")
    }
}