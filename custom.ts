/**
 * 机器人基础移动控制系统
 */
//% weight=250 color=#ff6b35 icon="\uf544"
namespace RobotMovement {
    
    //% blockId=robot_move_single_step
    //% block="机器人单步移动 %direction"
    //% direction.defl=FORWARD
    //% group="精确移动"
    //% weight=100
    export function moveSingleStep(direction: SixDirection): void {
        agent.move(direction, 1)
        player.say(`机器人${getDirectionName(direction)}移动1步`)
    }
    
    //% blockId=robot_move_multiple_steps
    //% block="机器人移动 %direction %steps 步"
    //% direction.defl=FORWARD
    //% steps.min=1 steps.max=100 steps.defl=5
    //% group="精确移动"
    //% weight=95
    export function moveMultipleSteps(direction: SixDirection, steps: number): void {
        agent.move(direction, steps)
        player.say(`机器人${getDirectionName(direction)}移动${steps}步`)
    }
    
    //% blockId=robot_turn_left
    //% block="机器人向左转"
    //% group="方向控制"
    //% weight=100
    export function turnLeft(): void {
        agent.turn(LEFT_TURN)
        player.say("机器人向左转")
    }
    
    //% blockId=robot_turn_right
    //% block="机器人向右转"
    //% group="方向控制"
    //% weight=95
    export function turnRight(): void {
        agent.turn(RIGHT_TURN)
        player.say("机器人向右转")
    }
    
    //% blockId=robot_move_pattern_square
    //% block="机器人方形移动 边长:%size"
    //% size.min=2 size.max=20 size.defl=5
    //% group="移动模式"
    //% weight=100
    export function moveSquarePattern(size: number): void {
        player.say(`开始方形移动，边长: ${size}`)
        for (let side = 0; side < 4; side++) {
            agent.move(FORWARD, size)
            agent.turn(RIGHT_TURN)
            loops.pause(500)
        }
        player.say("方形移动完成")
    }
    
    //% blockId=robot_move_pattern_line
    //% block="机器人直线往返 距离:%distance 次数:%times"
    //% distance.min=1 distance.max=50 distance.defl=10
    //% times.min=1 times.max=10 times.defl=3
    //% group="移动模式"
    //% weight=95
    export function moveLinePattern(distance: number, times: number): void {
        for (let i = 0; i < times; i++) {
            agent.move(FORWARD, distance)
            loops.pause(300)
            agent.move(BACK, distance)
            loops.pause(300)
        }
        player.say(`直线往返完成，${times}次`)
    }
    
    //% blockId=robot_teleport_to_player
    //% block="机器人传送到玩家位置"
    //% group="快速传送"
    //% weight=100
    export function teleportToPlayer(): void {
        agent.teleportToPlayer()
        player.say("机器人已传送到玩家位置")
    }
    
    //% blockId=robot_teleport_relative
    //% block="机器人相对传送 x:%x y:%y z:%z"
    //% x.min=-50 x.max=50 x.defl=0
    //% y.min=-30 y.max=30 y.defl=0
    //% z.min=-50 z.max=50 z.defl=0
    //% group="快速传送"
    //% weight=95
    export function teleportRelative(x: number, y: number, z: number): void {
        const currentPos = agent.getPosition()
        const newPos = currentPos.add(positions.create(x, y, z))
        agent.teleport(newPos, agent.getOrientation())
        player.say(`机器人相对传送: (${x}, ${y}, ${z})`)
    }
    
    function getDirectionName(direction: SixDirection): string {
        switch (direction) {
            case FORWARD: return "向前"
            case BACK: return "向后"
            case LEFT: return "向左"
            case RIGHT: return "向右"
            case UP: return "向上"
            case DOWN: return "向下"
            default: return "未知方向"
        }
    }
}

/**
 * 机器人建造专家系统
 */
//% weight=240 color=#4CAF50 icon="\uf0ad"
namespace RobotBuilder {
    
    //% blockId=robot_place_single_block
    //% block="机器人放置方块 %block 在 %direction"
    //% block.defl=STONE
    //% direction.defl=DOWN
    //% group="单块操作"
    //% weight=100
    export function placeSingleBlock(block: Block, direction: SixDirection): void {
        agent.setItem(block, 64, 1)
        agent.setSlot(1)
        agent.place(direction)
        player.say(`在${getDirectionName(direction)}放置了${getBlockName(block)}`)
    }
    
    //% blockId=robot_place_block_line
    //% block="机器人放置方块线 %block 长度:%length 方向:%direction"
    //% block.defl=COBBLESTONE
    //% length.min=1 length.max=50 length.defl=10
    //% direction.defl=FORWARD
    //% group="线性建造"
    //% weight=100
    export function placeBlockLine(block: Block, length: number, direction: SixDirection): void {
        agent.setItem(block, 64, 1)
        agent.setSlot(1)
        
        for (let i = 0; i < length; i++) {
            agent.place(DOWN)
            if (i < length - 1) {
                agent.move(direction, 1)
            }
            loops.pause(100)
        }
        player.say(`建造了${length}格长的${getBlockName(block)}线`)
    }
    
    //% blockId=robot_build_wall_detailed
    //% block="机器人建造墙壁 长度:%length 高度:%height 厚度:%thickness 材料:%material"
    //% length.min=1 length.max=50 length.defl=10
    //% height.min=1 height.max=20 height.defl=5
    //% thickness.min=1 thickness.max=5 thickness.defl=1
    //% material.defl=STONE_BRICKS
    //% group="墙体建造"
    //% weight=100
    export function buildDetailedWall(length: number, height: number, thickness: number, material: Block): void {
        agent.setItem(material, 64, 1)
        agent.setSlot(1)
        
        for (let t = 0; t < thickness; t++) {
            for (let h = 0; h < height; h++) {
                for (let l = 0; l < length; l++) {
                    agent.place(DOWN)
                    if (l < length - 1) {
                        agent.move(FORWARD, 1)
                    }
                    loops.pause(50)
                }
                if (h < height - 1) {
                    agent.move(UP, 1)
                    agent.move(BACK, length - 1)
                }
            }
            if (t < thickness - 1) {
                agent.move(RIGHT, 1)
                agent.move(DOWN, height - 1)
            }
        }
        player.say(`墙壁建造完成: ${length}x${height}x${thickness}`)
    }
    
    //% blockId=robot_build_floor
    //% block="机器人建造地板 长度:%length 宽度:%width 材料:%material"
    //% length.min=1 length.max=30 length.defl=10
    //% width.min=1 width.max=30 width.defl=10
    //% material.defl=PLANKS_OAK
    //% group="平面建造"
    //% weight=100
    export function buildFloor(length: number, width: number, material: Block): void {
        agent.setItem(material, 64, 1)
        agent.setSlot(1)
        
        for (let l = 0; l < length; l++) {
            for (let w = 0; w < width; w++) {
                agent.place(DOWN)
                if (w < width - 1) {
                    agent.move(FORWARD, 1)
                }
                loops.pause(50)
            }
            if (l < length - 1) {
                agent.move(RIGHT, 1)
                agent.move(BACK, width - 1)
            }
        }
        player.say(`地板建造完成: ${length}x${width}`)
    }
    
    //% blockId=robot_build_stairs
    //% block="机器人建造楼梯 高度:%height 材料:%material"
    //% height.min=1 height.max=20 height.defl=5
    //% material.defl=COBBLESTONE_STAIRS
    //% group="特殊结构"
    //% weight=100
    export function buildStairs(height: number, material: Block): void {
        agent.setItem(material, 64, 1)
        agent.setSlot(1)
        
        for (let i = 0; i < height; i++) {
            agent.place(DOWN)
            agent.move(FORWARD, 1)
            agent.move(UP, 1)
            loops.pause(200)
        }
        player.say(`楼梯建造完成，高度: ${height}`)
    }
    
    //% blockId=robot_build_tower
    //% block="机器人建造塔楼 高度:%height 直径:%diameter 材料:%material"
    //% height.min=5 height.max=50 height.defl=15
    //% diameter.min=3 diameter.max=15 diameter.defl=5
    //% material.defl=STONE_BRICKS
    //% group="复杂建造"
    //% weight=100
    export function buildTower(height: number, diameter: number, material: Block): void {
        const startPos = agent.getPosition()
        const radius = Math.floor(diameter / 2)
        
        for (let level = 0; level < height; level++) {
            buildCircleLevel(startPos.add(positions.create(0, level, 0)), radius, material)
        }
        player.say(`塔楼建造完成: 高度${height}, 直径${diameter}`)
    }
    
    //% blockId=robot_build_bridge
    //% block="机器人建造桥梁 长度:%length 宽度:%width 材料:%material"
    //% length.min=5 length.max=100 length.defl=20
    //% width.min=3 width.max=10 width.defl=5
    //% material.defl=PLANKS_OAK
    //% group="复杂建造"
    //% weight=95
    export function buildBridge(length: number, width: number, material: Block): void {
        // 建造桥面
        buildFloor(length, width, material)
        
        // 建造护栏
        agent.setItem(OAK_FENCE, 64, 2)
        agent.setSlot(2)
        
        // 左侧护栏
        for (let i = 0; i < length; i++) {
            agent.teleport(agent.getPosition().add(positions.create(i, 1, 0)), 0)
            agent.place(DOWN)
        }
        
        // 右侧护栏
        for (let i = 0; i < length; i++) {
            agent.teleport(agent.getPosition().add(positions.create(i, 1, width - 1)), 0)
            agent.place(DOWN)
        }
        
        player.say(`桥梁建造完成: ${length}x${width}`)
    }
    
    function buildCircleLevel(center: Position, radius: number, material: Block): void {
        agent.setItem(material, 64, 1)
        agent.setSlot(1)
        
        for (let x = -radius; x <= radius; x++) {
            for (let z = -radius; z <= radius; z++) {
                const distance = Math.sqrt(x * x + z * z)
                if (distance <= radius && distance >= radius - 1) {
                    agent.teleport(center.add(positions.create(x, 0, z)), 0)
                    agent.place(DOWN)
                }
            }
        }
    }
    
    function getBlockName(block: Block): string {
        switch (block) {
            case STONE: return "石头"
            case COBBLESTONE: return "圆石"
            case STONE_BRICKS: return "石砖"
            case PLANKS_OAK: return "橡木板"
            case DIRT: return "泥土"
            default: return "方块"
        }
    }
    
    function getDirectionName(direction: SixDirection): string {
        switch (direction) {
            case FORWARD: return "前方"
            case BACK: return "后方"
            case LEFT: return "左侧"
            case RIGHT: return "右侧"
            case UP: return "上方"
            case DOWN: return "下方"
            default: return "未知方向"
        }
    }
}

/**
 * 机器人挖掘大师系统
 */
//% weight=230 color=#2196F3 icon="\uf7a2"
namespace RobotMiner {
    
    //% blockId=robot_destroy_single
    //% block="机器人破坏 %direction 的方块"
    //% direction.defl=FORWARD
    //% group="单块破坏"
    //% weight=100
    export function destroySingle(direction: SixDirection): void {
        if (agent.detect(AgentDetection.Block, direction)) {
            agent.destroy(direction)
            agent.collectAll()
            player.say(`破坏了${getDirectionName(direction)}的方块`)
        } else {
            player.say(`${getDirectionName(direction)}没有方块`)
        }
    }
    
    //% blockId=robot_destroy_line
    //% block="机器人破坏一条线 方向:%direction 长度:%length"
    //% direction.defl=FORWARD
    //% length.min=1 length.max=50 length.defl=10
    //% group="线性挖掘"
    //% weight=100
    export function destroyLine(direction: SixDirection, length: number): void {
        let destroyed = 0
        
        for (let i = 0; i < length; i++) {
            if (agent.detect(AgentDetection.Block, direction)) {
                agent.destroy(direction)
                destroyed++
            }
            agent.move(direction, 1)
            agent.collectAll()
            loops.pause(100)
        }
        player.say(`挖掘线完成，破坏了 ${destroyed} 个方块`)
    }
    
    //% blockId=robot_dig_shaft_down
    //% block="机器人向下挖掘竖井 深度:%depth 放置梯子:%placeLadder"
    //% depth.min=1 depth.max=100 depth.defl=20
    //% placeLadder.defl=true
    //% group="竖井挖掘"
    //% weight=100
    export function digShaftDown(depth: number, placeLadder: boolean): void {
        if (placeLadder) {
            agent.setItem(LADDER, 64, 2)
        }
        
        let blocksDestroyed = 0
        
        for (let i = 0; i < depth; i++) {
            if (agent.detect(AgentDetection.Block, DOWN)) {
                agent.destroy(DOWN)
                blocksDestroyed++
            }
            
            agent.move(DOWN, 1)
            
            if (placeLadder) {
                agent.setSlot(2)
                agent.place(FORWARD)
                agent.setSlot(1)
            }
            
            agent.collectAll()
            loops.pause(200)
        }
        
        player.say(`竖井挖掘完成: 深度${depth}, 破坏${blocksDestroyed}个方块`)
    }
    
    //% blockId=robot_dig_horizontal_tunnel
    //% block="机器人挖掘水平隧道 长度:%length 高度:%height 宽度:%width"
    //% length.min=1 length.max=100 length.defl=30
    //% height.min=2 height.max=10 height.defl=3
    //% width.min=1 width.max=10 width.defl=3
    //% group="隧道挖掘"
    //% weight=100
    export function digHorizontalTunnel(length: number, height: number, width: number): void {
        let totalDestroyed = 0
        
        for (let l = 0; l < length; l++) {
            for (let h = 0; h < height; h++) {
                for (let w = 0; w < width; w++) {
                    if (agent.detect(AgentDetection.Block, DOWN)) {
                        agent.destroy(DOWN)
                        totalDestroyed++
                    }
                    
                    if (w < width - 1) {
                        agent.move(RIGHT, 1)
                    }
                    
                    agent.collectAll()
                    loops.pause(50)
                }
                
                if (h < height - 1) {
                    agent.move(UP, 1)
                    agent.move(LEFT, width - 1)
                }
            }
            
            if (l < length - 1) {
                agent.move(FORWARD, 1)
                agent.move(DOWN, height - 1)
            }
        }
        
        player.say(`隧道挖掘完成: ${length}x${height}x${width}, 破坏${totalDestroyed}个方块`)
    }
    
    //% blockId=robot_strip_mine
    //% block="机器人条带挖掘 长度:%length 条带数:%strips 间距:%spacing"
    //% length.min=10 length.max=100 length.defl=30
    //% strips.min=2 strips.max=10 strips.defl=5
    //% spacing.min=2 spacing.max=5 spacing.defl=3
    //% group="高级挖掘"
    //% weight=100
    export function stripMine(length: number, strips: number, spacing: number): void {
        let totalOres = 0
        
        for (let strip = 0; strip < strips; strip++) {
            // 挖掘当前条带
            for (let i = 0; i < length; i++) {
                // 挖掘中央
                if (agent.detect(AgentDetection.Block, DOWN)) {
                    agent.destroy(DOWN)
                    if (isOreBlock(agent.inspect(AgentInspection.Block, DOWN))) {
                        totalOres++
                    }
                }
                
                // 挖掘两侧
                agent.destroy(LEFT)
                agent.destroy(RIGHT)
                
                if (i < length - 1) {
                    agent.move(FORWARD, 1)
                }
                
                agent.collectAll()
                loops.pause(100)
            }
            
            // 移动到下一条带
            if (strip < strips - 1) {
                agent.move(BACK, length - 1)
                agent.move(RIGHT, spacing)
            }
        }
        
        player.say(`条带挖掘完成: ${strips}条带, 发现${totalOres}个矿物`)
    }
    
    //% blockId=robot_quarry_mine
    //% block="机器人露天采矿 大小:%size 深度:%depth"
    //% size.min=5 size.max=50 size.defl=16
    //% depth.min=5 depth.max=30 depth.defl=15
    //% group="露天挖掘"
    //% weight=100
    export function quarryMine(size: number, depth: number): void {
        let totalBlocks = 0
        let oreCount = 0
        
        for (let level = 0; level < depth; level++) {
            for (let x = 0; x < size; x++) {
                for (let z = 0; z < size; z++) {
                    if (agent.detect(AgentDetection.Block, DOWN)) {
                        const blockType = agent.inspect(AgentInspection.Block, DOWN)
                        agent.destroy(DOWN)
                        totalBlocks++
                        
                        if (isOreBlock(blockType)) {
                            oreCount++
                            player.say(`发现矿物! 类型: ${blockType}`)
                        }
                    }
                    
                    if (z < size - 1) {
                        agent.move(FORWARD, 1)
                    }
                    
                    agent.collectAll()
                    loops.pause(50)
                }
                
                if (x < size - 1) {
                    agent.move(RIGHT, 1)
                    agent.move(BACK, size - 1)
                }
            }
            
            if (level < depth - 1) {
                agent.move(DOWN, 1)
                agent.move(LEFT, size - 1)
            }
        }
        
        player.say(`露天采矿完成: ${size}x${size}x${depth}, 挖掘${totalBlocks}方块, 发现${oreCount}矿物`)
    }
    
    //% blockId=robot_ore_search
    //% block="机器人矿物搜索 半径:%radius 深度:%depth"
    //% radius.min=5 radius.max=30 radius.defl=15
    //% depth.min=5 depth.max=50 depth.defl=20
    //% group="矿物搜索"
    //% weight=100
    export function oreSearch(radius: number, depth: number): void {
        const startPos = agent.getPosition()
        let oresFound = 0
        const oreTypes: {[key: number]: number} = {}
        
        for (let y = 0; y < depth; y++) {
            for (let x = -radius; x <= radius; x++) {
                for (let z = -radius; z <= radius; z++) {
                    const distance = Math.sqrt(x * x + z * z)
                    if (distance <= radius) {
                        const checkPos = startPos.add(positions.create(x, -y, z))
                        agent.teleport(checkPos, 0)
                        
                        if (agent.detect(AgentDetection.Block, DOWN)) {
                            const blockType = agent.inspect(AgentInspection.Block, DOWN)
                            if (isOreBlock(blockType)) {
                                oresFound++
                                oreTypes[blockType] = (oreTypes[blockType] || 0) + 1
                                
                                // 标记矿物位置
                                mobs.spawnParticle(EXPLOSION, checkPos)
                            }
                        }
                    }
                }
            }
        }
        
        agent.teleport(startPos, 0)
        player.say(`矿物搜索完成! 发现${oresFound}个矿物`)
        
        for (let oreType in oreTypes) {
            player.say(`${getOreName(parseInt(oreType))}: ${oreTypes[oreType]}个`)
        }
    }
    
    function isOreBlock(blockType: number): boolean {
        return blockType === DIAMOND_ORE || blockType === GOLD_ORE || 
               blockType === IRON_ORE || blockType === COAL_ORE ||
               blockType === LAPIS_ORE || blockType === EMERALD_ORE ||
               blockType === REDSTONE_ORE
    }
    
    function getOreName(blockType: number): string {
        switch (blockType) {
            case DIAMOND_ORE: return "钻石矿"
            case GOLD_ORE: return "金矿"
            case IRON_ORE: return "铁矿"
            case COAL_ORE: return "煤矿"
            case LAPIS_ORE: return "青金石矿"
            case EMERALD_ORE: return "绿宝石矿"
            case REDSTONE_ORE: return "红石矿"
            default: return "未知矿物"
        }
    }
    
    function getDirectionName(direction: SixDirection): string {
        switch (direction) {
            case FORWARD: return "前方"
            case BACK: return "后方"
            case LEFT: return "左侧"
            case RIGHT: return "右侧"
            case UP: return "上方"
            case DOWN: return "下方"
            default: return "未知方向"
        }
    }
}

/**
 * 机器人农业专家系统
 */
//% weight=220 color=#8BC34A icon="\uf7bb"
namespace RobotFarmer {
    
    //% blockId=robot_till_single
    //% block="机器人耕地 %direction"
    //% direction.defl=DOWN
    //% group="土地准备"
    //% weight=100
    export function tillSingle(direction: SixDirection): void {
        agent.till(direction)
        player.say(`${getDirectionName(direction)}耕地完成`)
    }
    
    //% blockId=robot_till_area
    //% block="机器人耕地区域 长度:%length 宽度:%width"
    //% length.min=1 length.max=30 length.defl=10
    //% width.min=1 width.max=30 width.defl=10
    //% group="土地准备"
    //% weight=95
    export function tillArea(length: number, width: number): void {
        let tilledBlocks = 0
        
        for (let l = 0; l < length; l++) {
            for (let w = 0; w < width; w++) {
                agent.till(DOWN)
                tilledBlocks++
                
                if (w < width - 1) {
                    agent.move(FORWARD, 1)
                }
                loops.pause(100)
            }
            
            if (l < length - 1) {
                agent.move(RIGHT, 1)
                agent.move(BACK, width - 1)
            }
        }
        
        player.say(`耕地完成: ${length}x${width}, 共${tilledBlocks}块`)
    }
    
    //% blockId=robot_plant_crop_single
    //% block="机器人种植 %crop 在 %direction"
    //% crop.defl=SEEDS
    //% direction.defl=DOWN
    //% group="种植作物"
    //% weight=100
    export function plantCropSingle(crop: Item, direction: SixDirection): void {
        agent.setItem(crop, 64, 1)
        agent.setSlot(1)
        agent.place(direction)
        player.say(`种植了${getCropName(crop)}`)
    }
    
    //% blockId=robot_plant_crop_line
    //% block="机器人种植作物线 %crop 长度:%length"
    //% crop.defl=SEEDS
    //% length.min=1 length.max=50 length.defl=10
    //% group="种植作物"
    //% weight=95
    export function plantCropLine(crop: Item, length: number): void {
        agent.setItem(crop, 64, 1)
        agent.setSlot(1)
        
        for (let i = 0; i < length; i++) {
            agent.till(DOWN)
            agent.place(DOWN)
            
            if (i < length - 1) {
                agent.move(FORWARD, 1)
            }
            loops.pause(150)
        }
        
        player.say(`种植了${length}格的${getCropName(crop)}`)
    }
    
    //% blockId=robot_create_farm_basic
    //% block="机器人创建基础农场 大小:%size 作物:%crop"
    //% size.min=3 size.max=25 size.defl=9
    //% crop.defl=SEEDS
    //% group="农场建设"
    //% weight=100
    export function createBasicFarm(size: number, crop: Item): void {
        // 准备物品
        agent.setItem(DIRT, 64, 1)
        agent.setItem(crop, 64, 2)
        
        for (let x = 0; x < size; x++) {
            for (let z = 0; z < size; z++) {
                // 放置泥土
                agent.setSlot(1)
                agent.place(DOWN)
                
                // 耕地
                agent.till(DOWN)
                
                // 种植作物
                agent.setSlot(2)
                agent.place(DOWN)
                
                if (z < size - 1) {
                    agent.move(FORWARD, 1)
                }
                loops.pause(100)
            }
            
            if (x < size - 1) {
                agent.move(RIGHT, 1)
                agent.move(BACK, size - 1)
            }
        }
        
        player.say(`基础农场创建完成: ${size}x${size}, 种植${getCropName(crop)}`)
    }
    
    //% blockId=robot_create_farm_advanced
    //% block="机器人创建高级农场 大小:%size 作物:%crop 自动灌溉:%irrigation"
    //% size.min=5 size.max=30 size.defl=12
    //% crop.defl=SEEDS
    //% irrigation.defl=true
    //% group="农场建设"
    //% weight=95
export function createAdvancedFarm(size: number, crop: Item, irrigation: boolean): void {
       // 准备物品
       agent.setItem(DIRT, 64, 1)
       agent.setItem(crop, 64, 2)
       agent.setItem(WATER_BUCKET, 8, 3)
       agent.setItem(OAK_FENCE, 64, 4)
       
       // 建造围栏
       buildFarmFence(size)
       
       // 创建农田
       for (let x = 1; x < size - 1; x++) {
           for (let z = 1; z < size - 1; z++) {
               agent.teleport(agent.getPosition().add(positions.create(x, 0, z)), 0)
               
               // 如果需要灌溉且是水源位置
               if (irrigation && x % 4 === 0 && z % 4 === 0) {
                   agent.setSlot(3)
                   agent.place(DOWN)
               } else {
                   // 放置泥土并种植
                   agent.setSlot(1)
                   agent.place(DOWN)
                   agent.till(DOWN)
                   agent.setSlot(2)
                   agent.place(DOWN)
               }
               loops.pause(50)
           }
       }
       
       player.say(`高级农场创建完成: ${size}x${size}, ${irrigation ? "含灌溉系统" : "无灌溉"}`)
   }
   
   //% blockId=robot_harvest_crop_single
   //% block="机器人收割 %direction 的作物"
   //% direction.defl=DOWN
   //% group="收割管理"
   //% weight=100
   export function harvestCropSingle(direction: SixDirection): void {
       if (agent.detect(AgentDetection.Block, direction)) {
           agent.destroy(direction)
           agent.collectAll()
           player.say(`收割了${getDirectionName(direction)}的作物`)
       } else {
           player.say(`${getDirectionName(direction)}没有作物`)
       }
   }
   
   //% blockId=robot_harvest_and_replant
   //% block="机器人收割并重种 范围:%range 作物:%crop"
   //% range.min=3 range.max=25 range.defl=10
   //% crop.defl=SEEDS
   //% group="收割管理"
   //% weight=95
   export function harvestAndReplant(range: number, crop: Item): void {
       agent.setItem(crop, 64, 1)
       let harvestedCount = 0
       
       for (let x = 0; x < range; x++) {
           for (let z = 0; z < range; z++) {
               if (agent.detect(AgentDetection.Block, DOWN)) {
                   // 收割
                   agent.destroy(DOWN)
                   agent.collectAll()
                   harvestedCount++
                   
                   // 重新耕地并种植
                   agent.till(DOWN)
                   agent.setSlot(1)
                   agent.place(DOWN)
               }
               
               if (z < range - 1) {
                   agent.move(FORWARD, 1)
               }
               loops.pause(100)
           }
           
           if (x < range - 1) {
               agent.move(RIGHT, 1)
               agent.move(BACK, range - 1)
           }
       }
       
       player.say(`收割并重种完成: 收获${harvestedCount}个作物`)
   }
   
   //% blockId=robot_fertilize_crops
   //% block="机器人施肥 范围:%range 使用骨粉"
   //% range.min=3 range.max=20 range.defl=8
   //% group="作物护理"
   //% weight=100
   export function fertilizeCrops(range: number): void {
       agent.setItem(BONE_MEAL, 64, 1)
       agent.setSlot(1)
       let fertilizedCount = 0
       
       for (let x = 0; x < range; x++) {
           for (let z = 0; z < range; z++) {
               if (agent.detect(AgentDetection.Block, DOWN)) {
                   agent.interact(DOWN) // 使用骨粉
                   fertilizedCount++
               }
               
               if (z < range - 1) {
                   agent.move(FORWARD, 1)
               }
               loops.pause(200)
           }
           
           if (x < range - 1) {
               agent.move(RIGHT, 1)
               agent.move(BACK, range - 1)
           }
       }
       
       player.say(`施肥完成: 给${fertilizedCount}个作物施肥`)
   }
   
   //% blockId=robot_create_animal_pen
   //% block="机器人建造动物围栏 大小:%size 高度:%height"
   //% size.min=5 size.max=20 size.defl=8
   //% height.min=2 height.max=5 height.defl=2
   //% group="畜牧设施"
   //% weight=100
   export function createAnimalPen(size: number, height: number): void {
       agent.setItem(OAK_FENCE, 64, 1)
       agent.setSlot(1)
       
       for (let h = 0; h < height; h++) {
           // 建造四面围栏
           for (let side = 0; side < 4; side++) {
               for (let i = 0; i < size; i++) {
                   agent.place(DOWN)
                   if (i < size - 1) {
                       agent.move(FORWARD, 1)
                   }
                   loops.pause(50)
               }
               agent.turn(RIGHT_TURN)
           }
           
           if (h < height - 1) {
               agent.move(UP, 1)
           }
       }
       
       // 添加门
       agent.move(DOWN, height - 1)
       agent.setItem(OAK_FENCE_GATE, 1, 2)
       agent.setSlot(2)
       agent.place(FORWARD)
       
       player.say(`动物围栏建造完成: ${size}x${size}x${height}`)
   }
   
   //% blockId=robot_feed_animals
   //% block="机器人喂养动物 食物:%food 范围:%range"
   //% food.defl=WHEAT
   //% range.min=3 range.max=15 range.defl=8
   //% group="动物护理"
   //% weight=100
   export function feedAnimals(food: Item, range: number): void {
       agent.setItem(food, 64, 1)
       agent.setSlot(1)
       let animalsFed = 0
       
       for (let x = -range; x <= range; x++) {
           for (let z = -range; z <= range; z++) {
               agent.teleport(agent.getPosition().add(positions.create(x, 0, z)), 0)
               
               // 模拟喂养动物
               agent.interact(DOWN)
               animalsFed++
               
               // 添加爱心效果
               mobs.spawnParticle(HEART, agent.getPosition())
               loops.pause(300)
           }
       }
       
       player.say(`动物喂养完成: 喂养了${animalsFed}只动物`)
   }
   
   function buildFarmFence(size: number): void {
       agent.setSlot(4) // 使用围栏
       
       // 建造外围围栏
       for (let side = 0; side < 4; side++) {
           for (let i = 0; i < size; i++) {
               agent.place(DOWN)
               if (i < size - 1) {
                   agent.move(FORWARD, 1)
               }
           }
           agent.turn(RIGHT_TURN)
       }
       
       // 添加门
       agent.setItem(OAK_FENCE_GATE, 1, 5)
       agent.setSlot(5)
       agent.place(FORWARD)
   }
   
   function getCropName(crop: Item): string {
       switch (crop) {
           case SEEDS: return "小麦种子"
           case CARROT: return "胡萝卜"
           case POTATO: return "土豆"
           case BEETROOT_SEEDS: return "甜菜种子"
           case PUMPKIN_SEEDS: return "南瓜种子"
           case MELON_SEEDS: return "西瓜种子"
           default: return "作物"
       }
   }
   
   function getDirectionName(direction: SixDirection): string {
       switch (direction) {
           case FORWARD: return "前方"
           case BACK: return "后方"
           case LEFT: return "左侧"
           case RIGHT: return "右侧"
           case UP: return "上方"
           case DOWN: return "下方"
           default: return "未知方向"
       }
   }
}

/**
* 机器人安全防护系统
*/
//% weight=210 color=#FF9800 icon="\uf0e4"
namespace RobotGuard {
   
   //% blockId=robot_detect_single
   //% block="机器人检测 %direction 是否有 %detection"
   //% direction.defl=FORWARD
   //% detection.defl=AgentDetection.Block
   //% group="基础检测"
   //% weight=100
   export function detectSingle(direction: SixDirection, detection: AgentDetection): boolean {
       const result = agent.detect(detection, direction)
       player.say(`${getDirectionName(direction)}检测${getDetectionName(detection)}: ${result ? "有" : "无"}`)
       return result
   }
   
   //% blockId=robot_inspect_block_type
   //% block="机器人检查 %direction 方块类型"
   //% direction.defl=FORWARD
   //% group="详细检测"
   //% weight=100
   export function inspectBlockType(direction: SixDirection): void {
       if (agent.detect(AgentDetection.Block, direction)) {
           const blockType = agent.inspect(AgentInspection.Block, direction)
           const dataValue = agent.inspect(AgentInspection.Data, direction)
           player.say(`方块类型: ${blockType}, 数据值: ${dataValue}`)
       } else {
           player.say("该方向没有方块")
       }
   }
   
   //% blockId=robot_scan_area_blocks
   //% block="机器人扫描区域方块 半径:%radius"
   //% radius.min=1 radius.max=20 radius.defl=5
   //% group="区域扫描"
   //% weight=100
   export function scanAreaBlocks(radius: number): void {
       const startPos = agent.getPosition()
       let blockCount = 0
       const blockTypes: {[key: number]: number} = {}
       
       for (let x = -radius; x <= radius; x++) {
           for (let z = -radius; z <= radius; z++) {
               for (let y = -2; y <= 2; y++) {
                   agent.teleport(startPos.add(positions.create(x, y, z)), 0)
                   
                   if (agent.detect(AgentDetection.Block, DOWN)) {
                       const blockType = agent.inspect(AgentInspection.Block, DOWN)
                       blockCount++
                       blockTypes[blockType] = (blockTypes[blockType] || 0) + 1
                   }
               }
           }
       }
       
       agent.teleport(startPos, 0)
       player.say(`区域扫描完成: 发现${blockCount}个方块`)
       
       // 显示主要方块类型
       for (let blockType in blockTypes) {
           if (blockTypes[blockType] > 5) {
               player.say(`${blockType}: ${blockTypes[blockType]}个`)
           }
       }
   }
   
   //% blockId=robot_attack_single
   //% block="机器人攻击 %direction"
   //% direction.defl=FORWARD
   //% group="战斗行动"
   //% weight=100
   export function attackSingle(direction: SixDirection): void {
       agent.attack(direction)
       player.say(`向${getDirectionName(direction)}攻击`)
   }
   
   //% blockId=robot_attack_spin
   //% block="机器人旋转攻击 次数:%times"
   //% times.min=1 times.max=10 times.defl=4
   //% group="战斗行动"
   //% weight=95
   export function attackSpin(times: number): void {
       for (let i = 0; i < times; i++) {
           agent.attack(FORWARD)
           agent.turn(RIGHT_TURN)
           loops.pause(300)
       }
       player.say(`旋转攻击完成: ${times}次`)
   }
   
   //% blockId=robot_patrol_perimeter
   //% block="机器人周边巡逻 半径:%radius 圈数:%rounds"
   //% radius.min=3 radius.max=20 radius.defl=8
   //% rounds.min=1 rounds.max=10 rounds.defl=3
   //% group="巡逻任务"
   //% weight=100
   export function patrolPerimeter(radius: number, rounds: number): void {
       const startPos = agent.getPosition()
       
       for (let round = 0; round < rounds; round++) {
           player.say(`开始第${round + 1}轮巡逻`)
           
           // 方形巡逻
           for (let side = 0; side < 4; side++) {
               for (let step = 0; step < radius * 2; step++) {
                   agent.move(FORWARD, 1)
                   
                   // 检测威胁
                   if (detectThreats()) {
                       player.say("🚨 发现威胁！")
                       respondToThreat()
                   }
                   
                   loops.pause(200)
               }
               agent.turn(RIGHT_TURN)
           }
           
           // 返回起始位置
           agent.teleport(startPos, 0)
           loops.pause(1000)
       }
       
       player.say(`巡逻任务完成: ${rounds}圈`)
   }
   
   //% blockId=robot_guard_position
   //% block="机器人定点守卫 警戒半径:%alertRadius 时间:%duration 秒"
   //% alertRadius.min=3 alertRadius.max=15 alertRadius.defl=8
   //% duration.min=10 duration.max=300 duration.defl=60
   //% group="定点守卫"
   //% weight=100
   export function guardPosition(alertRadius: number, duration: number): void {
       const guardPos = agent.getPosition()
       const endTime = gameplay.timeQuery(GAME_TIME) + duration * 20 // 转换为游戏刻
       
       player.say(`开始定点守卫: 警戒半径${alertRadius}, 时间${duration}秒`)
       
       loops.forever(function() {
           // 检查时间
           if (gameplay.timeQuery(GAME_TIME) >= endTime) {
               player.say("守卫任务时间到，结束守卫")
               return
           }
           
           // 360度扫描
           for (let i = 0; i < 8; i++) {
               if (detectThreatsInDirection()) {
                   player.say("⚠️ 发现可疑活动")
                   respondToThreat()
               }
               agent.turn(RIGHT_TURN)
               loops.pause(500)
           }
           
           // 返回守卫位置
           agent.teleport(guardPos, 0)
           loops.pause(2000)
       })
   }
   
   //% blockId=robot_search_and_destroy
   //% block="机器人搜索摧毁 目标方块:%targetBlock 搜索半径:%radius"
   //% targetBlock.defl=TNT
   //% radius.min=5 radius.max=25 radius.defl=10
   //% group="搜索摧毁"
   //% weight=100
   export function searchAndDestroy(targetBlock: Block, radius: number): void {
       const startPos = agent.getPosition()
       let targetsDestroyed = 0
       
       for (let x = -radius; x <= radius; x++) {
           for (let z = -radius; z <= radius; z++) {
               for (let y = -5; y <= 5; y++) {
                   const checkPos = startPos.add(positions.create(x, y, z))
                   agent.teleport(checkPos, 0)
                   
                   if (agent.detect(AgentDetection.Block, DOWN)) {
                       const blockType = agent.inspect(AgentInspection.Block, DOWN)
                       if (blockType === targetBlock) {
                           agent.destroy(DOWN)
                           targetsDestroyed++
                           player.say(`摧毁目标: ${getBlockName(targetBlock)}`)
                           
                           // 爆炸效果
                           mobs.spawnParticle(EXPLOSION, checkPos)
                       }
                   }
               }
           }
       }
       
       agent.teleport(startPos, 0)
       player.say(`搜索摧毁完成: 摧毁${targetsDestroyed}个${getBlockName(targetBlock)}`)
   }
   
   //% blockId=robot_build_watchtower
   //% block="机器人建造瞭望塔 高度:%height 配备:%equipment"
   //% height.min=10 height.max=30 height.defl=15
   //% equipment.defl=true
   //% group="防御建设"
   //% weight=100
   export function buildWatchtower(height: number, equipment: boolean): void {
       const basePos = agent.getPosition()
       
       // 建造塔身
       agent.setItem(STONE_BRICKS, 64, 1)
       agent.setSlot(1)
       
       for (let level = 0; level < height; level++) {
           // 建造中空塔身
           for (let x = 0; x < 3; x++) {
               for (let z = 0; z < 3; z++) {
                   if (x === 0 || x === 2 || z === 0 || z === 2) {
                       agent.teleport(basePos.add(positions.create(x, level, z)), 0)
                       agent.place(DOWN)
                   }
               }
           }
           
           // 每5层添加楼梯
           if (level % 5 === 0 && level > 0) {
               agent.teleport(basePos.add(positions.create(1, level, 1)), 0)
               agent.setItem(STONE_BRICK_STAIRS, 64, 2)
               agent.setSlot(2)
               agent.place(DOWN)
               agent.setSlot(1)
           }
       }
       
       // 建造观察平台
       for (let x = -1; x <= 3; x++) {
           for (let z = -1; z <= 3; z++) {
               agent.teleport(basePos.add(positions.create(x, height, z)), 0)
               agent.place(DOWN)
           }
       }
       
       if (equipment) {
           // 添加设备
           agent.teleport(basePos.add(positions.create(1, height + 1, 1)), 0)
           agent.setItem(BEACON, 1, 3)
           agent.setSlot(3)
           agent.place(DOWN)
           
           // 添加照明
           agent.setItem(TORCH, 64, 4)
           agent.setSlot(4)
           for (let corner = 0; corner < 4; corner++) {
               const cornerPos = [
                   positions.create(-1, height + 1, -1),
                   positions.create(3, height + 1, -1),
                   positions.create(3, height + 1, 3),
                   positions.create(-1, height + 1, 3)
               ]
               agent.teleport(basePos.add(cornerPos[corner]), 0)
               agent.place(DOWN)
           }
       }
       
       player.say(`瞭望塔建造完成: 高度${height}, ${equipment ? "已配备设备" : "无设备"}`)
   }
   
   function detectThreats(): boolean {
       // 检测危险方块
       const dangerousBlocks = [TNT, LAVA, FIRE]
       
       for (let block of dangerousBlocks) {
           for (let dir of [FORWARD, BACK, LEFT, RIGHT]) {
               if (agent.detect(AgentDetection.Block, dir)) {
                   const blockType = agent.inspect(AgentInspection.Block, dir)
                   if (blockType === block) {
                       return true
                   }
               }
           }
       }
       return false
   }
   
   function detectThreatsInDirection(): boolean {
       if (agent.detect(AgentDetection.Block, FORWARD)) {
           const blockType = agent.inspect(AgentInspection.Block, FORWARD)
           return blockType === TNT || blockType === LAVA || blockType === FIRE
       }
       return false
   }
   
   function respondToThreat(): void {
       // 威胁响应
       mobs.spawnParticle(EXPLOSION, agent.getPosition().add(positions.create(0, 2, 0)))
       player.execute("playsound random.explode @a")
       agent.attack(FORWARD)
   }
   
   function getDetectionName(detection: AgentDetection): string {
       switch (detection) {
           case AgentDetection.Block: return "方块"
           case AgentDetection.Redstone: return "红石信号"
           default: return "未知"
       }
   }
   
   function getBlockName(block: Block): string {
       switch (block) {
           case TNT: return "TNT"
           case LAVA: return "岩浆"
           case FIRE: return "火焰"
           case STONE_BRICKS: return "石砖"
           default: return "方块"
       }
   }
   
   function getDirectionName(direction: SixDirection): string {
       switch (direction) {
           case FORWARD: return "前方"
           case BACK: return "后方"
           case LEFT: return "左侧"
           case RIGHT: return "右侧"
           case UP: return "上方"
           case DOWN: return "下方"
           default: return "未知方向"
       }
   }
}

/**
* 机器人物品管理系统
*/
//% weight=200 color=#9C27B0 icon="\uf0c3"
namespace RobotInventory {
   
   //% blockId=robot_set_item_slot
   //% block="机器人设置物品 %item 数量:%count 到槽位:%slot"
   //% item.defl=STONE
   //% count.min=1 count.max=64 count.defl=64
   //% slot.min=1 slot.max=27 slot.defl=1
   //% group="物品设置"
   //% weight=100
   export function setItemSlot(item: number, count: number, slot: number): void {
       agent.setItem(item, count, slot)
       player.say(`槽位${slot}设置: ${getItemName(item)} x${count}`)
   }
   
   //% blockId=robot_switch_slot
   //% block="机器人切换到槽位 %slot"
   //% slot.min=1 slot.max=27 slot.defl=1
   //% group="槽位管理"
   //% weight=100
   export function switchSlot(slot: number): void {
       agent.setSlot(slot)
       player.say(`切换到槽位${slot}`)
   }
   
   //% blockId=robot_drop_item_direction
   //% block="机器人丢弃物品 %direction 槽位:%slot 数量:%quantity"
   //% direction.defl=DOWN
   //% slot.min=1 slot.max=27 slot.defl=1
   //% quantity.min=1 quantity.max=64 quantity.defl=1
   //% group="物品丢弃"
   //% weight=100
   export function dropItemDirection(direction: SixDirection, slot: number, quantity: number): void {
       agent.drop(direction, slot, quantity)
       player.say(`向${getDirectionName(direction)}丢弃: 槽位${slot}, 数量${quantity}`)
   }
   
   //% blockId=robot_drop_all_direction
   //% block="机器人丢弃所有物品 %direction"
   //% direction.defl=DOWN
   //% group="物品丢弃"
   //% weight=95
   export function dropAllDirection(direction: SixDirection): void {
       agent.dropAll(direction)
       player.say(`向${getDirectionName(direction)}丢弃所有物品`)
   }
   
   //% blockId=robot_collect_items
   //% block="机器人收集周围物品"
   //% group="物品收集"
   //% weight=100
   export function collectItems(): void {
       agent.collectAll()
       player.say("收集周围物品完成")
   }
   
   //% blockId=robot_collect_specific
   //% block="机器人收集特定物品 %item"
   //% item.defl=STONE
   //% group="物品收集"
   //% weight=95
   export function collectSpecific(item: number): void {
       agent.collect(item)
       player.say(`收集${getItemName(item)}完成`)
   }
   
   //% blockId=robot_transfer_items
   //% block="机器人转移物品 数量:%quantity 从槽位:%from 到槽位:%to"
   //% quantity.min=1 quantity.max=64 quantity.defl=1
   //% from.min=1 from.max=27 from.defl=1
   //% to.min=1 to.max=27 to.defl=2
   //% group="物品转移"
   //% weight=100
   export function transferItems(quantity: number, from: number, to: number): void {
       agent.transfer(quantity, from, to)
       player.say(`转移${quantity}个物品: 槽位${from} → 槽位${to}`)
   }
   
   //% blockId=robot_get_item_count_slot
   //% block="获取槽位 %slot 物品数量"
   //% slot.min=1 slot.max=27 slot.defl=1
   //% group="物品查询"
   //% weight=100
   export function getItemCountSlot(slot: number): void {
       const count = agent.getItemCount(slot)
       player.say(`槽位${slot}物品数量: ${count}`)
   }
   
   //% blockId=robot_get_item_space_slot
   //% block="获取槽位 %slot 剩余空间"
   //% slot.min=1 slot.max=27 slot.defl=1
   //% group="物品查询"
   //% weight=95
   export function getItemSpaceSlot(slot: number): void {
       const space = agent.getItemSpace(slot)
       player.say(`槽位${slot}剩余空间: ${space}`)
   }
   
   //% blockId=robot_get_item_detail_slot
   //% block="获取槽位 %slot 物品详情"
   //% slot.min=1 slot.max=27 slot.defl=1
   //% group="物品查询"
   //% weight=90
   export function getItemDetailSlot(slot: number): void {
       const detail = agent.getItemDetail(slot)
       const count = agent.getItemCount(slot)
       player.say(`槽位${slot}: ${getItemName(detail)} x${count}`)
   }
   
   //% blockId=robot_inventory_report
   //% block="机器人背包完整报告"
   //% group="背包管理"
   //% weight=100
   export function inventoryReport(): void {
       player.say("=== 机器人背包报告 ===")
       
       let totalItems = 0
       let occupiedSlots = 0
       
       for (let slot = 1; slot <= 27; slot++) {
           const count = agent.getItemCount(slot)
           if (count > 0) {
               const detail = agent.getItemDetail(slot)
               const space = agent.getItemSpace(slot)
               player.say(`槽位${slot}: ${getItemName(detail)} x${count} (空余${space})`)
               totalItems += count
               occupiedSlots++
           }
       }
       
       player.say(`总计: ${totalItems}个物品, 占用${occupiedSlots}/27槽位`)
   }
   
   //% blockId=robot_organize_inventory
   //% block="机器人整理背包 模式:%mode"
   //% mode.defl="compact"
   //% group="背包管理"
   //% weight=95
   export function organizeInventory(mode: string): void {
       switch (mode) {
           case "compact":
               compactInventory()
               break
           case "sort":
               sortInventory()
               break
           case "clean":
               cleanInventory()
               break
       }
       player.say(`背包整理完成: ${mode}模式`)
   }
   
   //% blockId=robot_emergency_dump
   //% block="机器人紧急清空背包 保留槽位:%keepSlots"
   //% keepSlots.min=0 keepSlots.max=9 keepSlots.defl=3
   //% group="紧急操作"
   //% weight=100
   export function emergencyDump(keepSlots: number): void {
       let dumpedItems = 0
       
       for (let slot = keepSlots + 1; slot <= 27; slot++) {
           const count = agent.getItemCount(slot)
           if (count > 0) {
               agent.drop(DOWN, slot, count)
               dumpedItems += count
           }
       }
       
       player.say(`紧急清空完成: 丢弃${dumpedItems}个物品, 保留前${keepSlots}槽位`)
   }
   
   function compactInventory(): void {
       // 压缩背包，合并相同物品
       for (let slot1 = 1; slot1 <= 27; slot1++) {
           const item1 = agent.getItemDetail(slot1)
           const count1 = agent.getItemCount(slot1)
           const space1 = agent.getItemSpace(slot1)
           
           if (count1 > 0 && space1 > 0) {
               for (let slot2 = slot1 + 1; slot2 <= 27; slot2++) {
                   const item2 = agent.getItemDetail(slot2)
                   const count2 = agent.getItemCount(slot2)
                   
                   if (item1 === item2 && count2 > 0) {
                       const transferAmount = Math.min(space1, count2)
                       if (transferAmount > 0) {
                           agent.transfer(transferAmount, slot2, slot1)
                       }
                   }
               }
           }
       }
   }
   
   function sortInventory(): void {
       // 简单排序：工具在前，方块在中，其他在后
       const toolItems = [IRON_PICKAXE, IRON_SHOVEL, IRON_AXE, IRON_SWORD]
       const blockItems = [STONE, COBBLESTONE, DIRT, PLANKS_OAK]
       
       let currentSlot = 1
       
       // 先放置工具
       for (let slot = 1; slot <= 27; slot++) {
           const item = agent.getItemDetail(slot)
           if (toolItems.includes(item) && agent.getItemCount(slot) > 0) {
               if (slot !== currentSlot) {
                   agent.transfer(agent.getItemCount(slot), slot, currentSlot)
               }
               currentSlot++
           }
       }
       
       // 再放置方块
       for (let slot = 1; slot <= 27; slot++) {
           const item = agent.getItemDetail(slot)
           if (blockItems.includes(item) && agent.getItemCount(slot) > 0) {
               if (slot !== currentSlot) {
                   agent.transfer(agent.getItemCount(slot), slot, currentSlot)
               }
               currentSlot++
           }
       }
   }
   
   function cleanInventory(): void {
       // 清理无用物品
       const junkItems = [DIRT, COBBLESTONE, GRAVEL]
       
       for (let slot = 1; slot <= 27; slot++) {
           const item = agent.getItemDetail(slot)
           const count = agent.getItemCount(slot)
           
           if (junkItems.includes(item) && count > 32) {
               // 只保留32个，其余丢弃
               agent.drop(DOWN, slot, count - 32)
           }
       }
   }
   
   function getItemName(item: number): string {
       switch (item) {
           case STONE: return "石头"
           case DIRT: return "泥土"
           case COBBLESTONE: return "圆石"
           case PLANKS_OAK: return "橡木板"
           case IRON_PICKAXE: return "铁镐"
           case IRON_SHOVEL: return "铁锹"
           case IRON_AXE: return "铁斧"
           case IRON_SWORD: return "铁剑"
           case SEEDS: return "种子"
           case WHEAT: return "小麦"
           case BREAD: return "面包"
           case COAL: return "煤炭"
           case IRON_INGOT: return "铁锭"
           case GOLD_INGOT: return "金锭"
           case DIAMOND: return "钻石"
           default: return `物品${item}`
       }
   }
   
   function getDirectionName(direction: SixDirection): string {
       switch (direction) {
           case FORWARD: return "前方"
           case BACK: return "后方"
           case LEFT: return "左侧"
           case RIGHT: return "右侧"
           case UP: return "上方"
           case DOWN: return "下方"
           default: return "未知方向"
       }
   }
}

/**
* 机器人高级操作系统
*/
//% weight=190 color=#607D8B icon="\uf085"
namespace RobotAdvanced {
   
   //% blockId=robot_set_assist_mode
   //% block="机器人设置辅助模式 %assist 启用:%enabled"
   //% assist.defl=PLACE_ON_MOVE
   //% enabled.defl=true
   //% group="辅助功能"
   //% weight=100
   export function setAssistMode(assist: AgentAssist, enabled: boolean): void {
       agent.setAssist(assist, enabled)
       player.say(`辅助模式${getAssistName(assist)}: ${enabled ? "启用" : "禁用"}`)
   }
   
   //% blockId=robot_interact_direction
   //% block="机器人交互 %direction"
   //% direction.defl=FORWARD
   //% group="交互操作"
   //% weight=100
   export function interactDirection(direction: SixDirection): void {
       agent.interact(direction)
       player.say(`与${getDirectionName(direction)}交互完成`)
   }
   
   //% blockId=robot_complex_build_pattern
   //% block="机器人复杂建造模式 %pattern 大小:%size 材料:%material"
   //% pattern.defl="spiral"
   //% size.min=3 size.max=20 size.defl=8
   //% material.defl=STONE_BRICKS
   //% group="复杂建造"
   //% weight=100
   export function complexBuildPattern(pattern: string, size: number, material: Block): void {
       agent.setItem(material, 64, 1)
       agent.setSlot(1)
       
       switch (pattern) {
           case "spiral":
               buildSpiralPattern(size)
               break
           case "pyramid":
               buildPyramidPattern(size)
               break
           case "maze":
               buildMazePattern(size)
               break
           case "circle":
               buildCirclePattern(size)
               break
       }
       
       player.say(`${pattern}模式建造完成, 大小: ${size}`)
   }
   
   //% blockId=robot_automated_mining
   //% block="机器人自动挖矿 模式:%mode 参数:%param"
   //% mode.defl="branch"
   //% param.min=5 param.max=50 param.defl=20
   //% group="自动挖矿"
   //% weight=100
   export function automatedMining(mode: string, param: number): void {
       switch (mode) {
           case "branch":
               branchMining(param)
               break
           case "room":
               roomMining(param)
               break
           case "tunnel":
               tunnelMining(param)
               break
           case "shaft":
               shaftMining(param)
               break
       }
       
       player.say(`${mode}挖矿模式完成`)
   }
   
   //% blockId=robot_smart_farm_system
   //% block="机器人智能农场系统 操作:%operation 参数:%param"
   //% operation.defl="auto_harvest"
   //% param.min=5 param.max=25 param.defl=12
   //% group="智能农业"
   //% weight=100
   export function smartFarmSystem(operation: string, param: number): void {
       switch (operation) {
           case "auto_harvest":
               autoHarvestSystem(param)
               break
           case "plant_rotation":
               plantRotationSystem(param)
               break
           case "irrigation":
               irrigationSystem(param)
               break
           case "fertilize":
               fertilizeSystem(param)
               break
       }
       
       player.say(`智能农场${operation}操作完成`)
   }
   
   //% blockId=robot_defense_protocol
   //% block="机器人防御协议 级别:%level 范围:%range"
   //% level.min=1 level.max=5 level.defl=3
   //% range.min=5 range.max=25 range.defl=15
   //% group="防御系统"
   //% weight=100
   export function defenseProtocol(level: number, range: number): void {
       player.say(`激活防御协议: 级别${level}, 范围${range}`)
       
       if (level >= 1) {
           basicDefense(range)
       }
       if (level >= 3) {
           advancedDefense(range)
       }
       if (level >= 5) {
           ultimateDefense(range)
       }
   }
   
   //% blockId=robot_utility_functions
   //% block="机器人实用功能 功能:%function 参数:%param"
   //% function.defl="path_clear"
   //% param.min=5 param.max=50 param.defl=20
   //% group="实用工具"
   //% weight=100
   export function utilityFunctions(function_name: string, param: number): void {
       switch (function_name) {
           case "path_clear":
               clearPath(param)
               break
           case "area_light":
               lightUpArea(param)
               break
           case "bridge_build":
               buildBridge(param)
               break
           case "platform_create":
               createPlatform(param)
               break
       }
       
       player.say(`实用功能${function_name}完成`)
   }
   
   //% blockId=robot_emergency_protocols
   //% block="机器人紧急协议 类型:%protocol"
   //% protocol.defl="evacuation"
   //% group="紧急操作"
   //% weight=100
   export function emergencyProtocols(protocol: string): void {
       switch (protocol) {
           case "evacuation":
               evacuationProtocol()
               break
           case "lockdown":
               lockdownProtocol()
               break
           case "self_destruct":
               selfDestructProtocol()
               break
           case "return_home":
               returnHomeProtocol()
               break
       }
       
       player.say(`紧急协议${protocol}已执行`)
   }
   
   /**
    * 复杂建造模式实现
    */
   function buildSpiralPattern(size: number): void {
       let direction = 0 // 0:北 1:东 2:南 3:西
       let steps = 1
       
       for (let i = 0; i < size; i++) {
           for (let j = 0; j < steps; j++) {
               agent.place(DOWN)
               moveInDirection(direction)
               loops.pause(100)
           }
           
           // 转向
           agent.turn(RIGHT_TURN)
           direction = (direction + 1) % 4
           
           if (i % 2 === 1) {
               steps++
           }
       }
   }
   
   function buildPyramidPattern(size: number): void {
       for (let level = 0; level < size; level++) {
           const currentSize = size - level
           
           for (let x = 0; x < currentSize; x++) {
               for (let z = 0; z < currentSize; z++) {
                   agent.place(DOWN)
                   if (z < currentSize - 1) {
                       agent.move(FORWARD, 1)
                   }
                   loops.pause(50)
               }
               if (x < currentSize - 1) {
                   agent.move(RIGHT, 1)
                   agent.move(BACK, currentSize - 1)
               }
           }
           
           if (level < size - 1) {
               agent.move(UP, 1)
               agent.move(LEFT, currentSize - 1)
           }
       }
   }
   
   function buildMazePattern(size: number): void {
       // 简化迷宫生成
       for (let x = 0; x < size; x += 3) {
           for (let z = 0; z < size; z += 3) {
               if (Math.randomRange(0, 100) < 70) {
                   agent.teleport(agent.getPosition().add(positions.create(x, 0, z)), 0)
                   
                   // 建造小墙段
                   for (let h = 0; h < 3; h++) {
                       agent.place(DOWN)
                       agent.move(UP, 1)
                   }
                   agent.move(DOWN, 3)
               }
           }
       }
   }
   
   function buildCirclePattern(radius: number): void {
       const centerPos = agent.getPosition()
       
       for (let angle = 0; angle < 360; angle += 10) {
           const rad = angle * Math.PI / 180
           const x = Math.round(radius * Math.cos(rad))
           const z = Math.round(radius * Math.sin(rad))
           
           agent.teleport(centerPos.add(positions.create(x, 0, z)), 0)
           agent.place(DOWN)
           loops.pause(100)
       }
   }
   
   /**
    * 自动挖矿模式实现
    */
   function branchMining(param: number): void {
       // 分支挖矿
       for (let branch = 0; branch < 4; branch++) {
           for (let i = 0; i < param; i++) {
               agent.destroy(FORWARD)
               agent.destroy(UP)
               agent.move(FORWARD, 1)
               agent.collectAll()
               loops.pause(100)
           }
           
           // 返回中心并转向
           agent.move(BACK, param)
           agent.turn(RIGHT_TURN)
       }
   }
   
   function roomMining(param: number): void {
       // 房间挖矿
       for (let x = 0; x < param; x++) {
           for (let z = 0; z < param; z++) {
               for (let y = 0; y < 4; y++) {
                   agent.destroy(DOWN)
                   if (y < 3) agent.move(UP, 1)
               }
               agent.move(DOWN, 3)
               
               if (z < param - 1) {
                   agent.move(FORWARD, 1)
               }
               agent.collectAll()
               loops.pause(50)
           }
           
           if (x < param - 1) {
               agent.move(RIGHT, 1)
               agent.move(BACK, param - 1)
           }
       }
   }
   
   function tunnelMining(param: number): void {
       // 隧道挖矿
       for (let i = 0; i < param; i++) {
           // 挖掘3x3隧道
           for (let h = 0; h < 3; h++) {
               for (let w = -1; w <= 1; w++) {
                   if (w !== 0) agent.move(w > 0 ? RIGHT : LEFT, 1)
                   agent.destroy(DOWN)
                   if (w !== 0) agent.move(w > 0 ? LEFT : RIGHT, 1)
               }
               if (h < 2) agent.move(UP, 1)
           }
           
           agent.move(DOWN, 2)
           agent.move(FORWARD, 1)
           agent.collectAll()
           loops.pause(150)
       }
   }
   
   function shaftMining(param: number): void {
       // 竖井挖矿
       for (let depth = 0; depth < param; depth++) {
           agent.destroy(DOWN)
           agent.move(DOWN, 1)
           
           // 挖掘四周
           for (let dir = 0; dir < 4; dir++) {
               agent.destroy(FORWARD)
               agent.turn(RIGHT_TURN)
           }
           
           agent.collectAll()
           loops.pause(200)
       }
   }
   
   /**
    * 智能农业系统实现
    */
   function autoHarvestSystem(param: number): void {
       agent.setItem(SEEDS, 64, 1)
       
       for (let x = 0; x < param; x++) {
           for (let z = 0; z < param; z++) {
               if (agent.detect(AgentDetection.Block, DOWN)) {
                   // 收割
                   agent.destroy(DOWN)
                   agent.collectAll()
                   
                   // 重新种植
                   agent.till(DOWN)
                   agent.setSlot(1)
                   agent.place(DOWN)
               }
               
               if (z < param - 1) {
                   agent.move(FORWARD, 1)
               }
               loops.pause(100)
           }
           
           if (x < param - 1) {
               agent.move(RIGHT, 1)
               agent.move(BACK, param - 1)
           }
       }
   }
   
   function plantRotationSystem(param: number): void {
       const crops = [SEEDS, CARROT, POTATO, BEETROOT_SEEDS]
       
       for (let x = 0; x < param; x++) {
           const cropIndex = x % crops.length
           agent.setItem(crops[cropIndex], 64, cropIndex + 1)
           agent.setSlot(cropIndex + 1)
           
           for (let z = 0; z < param; z++) {
               agent.till(DOWN)
               agent.place(DOWN)
               
               if (z < param - 1) {
                   agent.move(FORWARD, 1)
               }
               loops.pause(100)
           }
           
           if (x < param - 1) {
               agent.move(RIGHT, 1)
               agent.move(BACK, param - 1)
           }
       }
   }
   
   function irrigationSystem(param: number): void {
       agent.setItem(WATER_BUCKET, 8, 1)
       agent.setSlot(1)
       
       // 每隔4格放置水源
       for (let x = 0; x < param; x += 4) {
           for (let z = 0; z < param; z += 4) {
               agent.teleport(agent.getPosition().add(positions.create(x, 0, z)), 0)
               agent.place(DOWN)
               loops.pause(200)
           }
       }
   }
   
   function fertilizeSystem(param: number): void {
       agent.setItem(BONE_MEAL, 64, 1)
       agent.setSlot(1)
       
       for (let x = 0; x < param; x++) {
           for (let z = 0; z < param; z++) {
               if (agent.detect(AgentDetection.Block, DOWN)) {
                   agent.interact(DOWN) // 施肥
               }
               
               if (z < param - 1) {
                   agent.move(FORWARD, 1)
               }
               loops.pause(150)
           }
           
           if (x < param - 1) {
               agent.move(RIGHT, 1)
               agent.move(BACK, param - 1)
           }
       }
   }
   
   /**
    * 防御系统实现
    */
   function basicDefense(range: number): void {
       // 基础防御：巡逻
       for (let round = 0; round < 3; round++) {
           for (let side = 0; side < 4; side++) {
               agent.move(FORWARD, range)
               agent.turn(RIGHT_TURN)
               loops.pause(1000)
           }
       }
   }
   
   function advancedDefense(range: number): void {
       // 高级防御：建造防御工事
       agent.setItem(COBBLESTONE, 64, 1)
       agent.setSlot(1)
       
       // 建造简单围墙
       for (let side = 0; side < 4; side++) {
           for (let i = 0; i < range; i++) {
               agent.place(DOWN)
               agent.place(UP)
               agent.move(FORWARD, 1)
               loops.pause(100)
           }
           agent.turn(RIGHT_TURN)
       }
   }
   
   function ultimateDefense(range: number): void {
       // 终极防御：激活所有防御措施
       basicDefense(range)
       advancedDefense(range)
       
       // 添加特殊效果
       mobs.spawnParticle(EXPLOSION, agent.getPosition().add(positions.create(0, 5, 0)))
       player.say("🛡️ 终极防御协议已激活！")
   }
   
   /**
    * 实用工具实现
    */
   function clearPath(param: number): void {
       // 清理路径
       for (let i = 0; i < param; i++) {
           agent.destroy(FORWARD)
           agent.destroy(UP)
           agent.move(FORWARD, 1)
           agent.collectAll()
           loops.pause(100)
       }
   }
   
   function lightUpArea(param: number): void {
       // 照亮区域
       agent.setItem(TORCH, 64, 1)
       agent.setSlot(1)
       
       for (let x = 0; x < param; x += 8) {
           for (let z = 0; z < param; z += 8) {
               agent.teleport(agent.getPosition().add(positions.create(x, 1, z)), 0)
               agent.place(DOWN)
               loops.pause(200)
           }
       }
   }
   
   function buildBridge(param: number): void {
       // 建造桥梁
       agent.setItem(PLANKS_OAK, 64, 1)
       agent.setSlot(1)
       
       for (let i = 0; i < param; i++) {
           agent.place(DOWN)
           agent.move(FORWARD, 1)
           loops.pause(100)
       }
       
       // 添加护栏
       agent.setItem(OAK_FENCE, 64, 2)
       agent.setSlot(2)
       agent.move(BACK, param)
       
       for (let i = 0; i < param; i++) {
           agent.move(LEFT, 1)
           agent.place(DOWN)
           agent.move(RIGHT, 2)
           agent.place(DOWN)
           agent.move(LEFT, 1)
           agent.move(FORWARD, 1)
       }
   }
   
   function createPlatform(param: number): void {
       // 创建平台
       agent.setItem(STONE, 64, 1)
       agent.setSlot(1)
       
       for (let x = 0; x < param; x++) {
           for (let z = 0; z < param; z++) {
               agent.place(DOWN)
               if (z < param - 1) {
                   agent.move(FORWARD, 1)
               }
               loops.pause(50)
           }
           
           if (x < param - 1) {
               agent.move(RIGHT, 1)
               agent.move(BACK, param - 1)
           }
       }
   }
   
   /**
    * 紧急协议实现
    */
   function evacuationProtocol(): void {
       player.say("🚨 紧急疏散协议启动！")
       agent.teleportToPlayer()
       
       // 疏散路径标记
       agent.setItem(TORCH, 64, 1)
       agent.setSlot(1)
       
       for (let i = 0; i < 20; i++) {
           agent.place(DOWN)
           agent.move(BACK, 2)
           loops.pause(200)
       }
   }
   
   function lockdownProtocol(): void {
       player.say("🔒 封锁协议启动！")
       
       // 封锁周围区域
       agent.setItem(IRON_BLOCK, 64, 1)
       agent.setSlot(1)
       
       for (let x = -5; x <= 5; x++) {
           for (let z = -5; z <= 5; z++) {
               if (x === -5 || x === 5 || z === -5 || z === 5) {
                   agent.teleport(agent.getPosition().add(positions.create(x, 0, z)), 0)
                   for (let y = 0; y < 4; y++) {
                       agent.place(DOWN)
                       agent.move(UP, 1)
                   }
                   agent.move(DOWN, 4)
               }
           }
       }
   }
   
   function selfDestructProtocol(): void {
       player.say("💥 自毁协议启动！倒计时10秒...")
       
       for (let i = 10; i > 0; i--) {
           player.say(`${i}...`)
           mobs.spawnParticle(EXPLOSION, agent.getPosition())
           loops.pause(1000)
       }
       
       // 大爆炸效果
       for (let i = 0; i < 10; i++) {
           mobs.spawnParticle(EXPLOSION_HUGE, agent.getPosition().add(positions.create(
               Math.randomRange(-5, 5), 
               Math.randomRange(0, 5), 
               Math.randomRange(-5, 5)
           )))
           loops.pause(200)
       }
       
       agent.teleportToPlayer()
       player.say("💥 自毁序列完成！机器人已重置")
   }
   
   function returnHomeProtocol(): void {
       player.say("🏠 返航协议启动！")
       agent.teleportToPlayer()
       
       // 返航信号
       for (let i = 0; i < 5; i++) {
           mobs.spawnParticle(SPARKLER, agent.getPosition().add(positions.create(0, 5, 0)))
           loops.pause(500)
       }
       
       player.say("✅ 机器人安全返航完成")
   }
   
   /**
    * 辅助函数
    */
   function moveInDirection(direction: number): void {
       switch (direction) {
           case 0: agent.move(FORWARD, 1); break
           case 1: agent.move(RIGHT, 1); break
           case 2: agent.move(BACK, 1); break
           case 3: agent.move(LEFT, 1); break
       }
   }
   
   function getAssistName(assist: AgentAssist): string {
       switch (assist) {
           case PLACE_ON_MOVE: return "移动时放置"
           case DESTROY_OBSTACLES: return "破坏障碍"
           default: return "未知辅助"
       }
   }
   
   function getDirectionName(direction: SixDirection): string {
       switch (direction) {
           case FORWARD: return "前方"
           case BACK: return "后方"
           case LEFT: return "左侧"
           case RIGHT: return "右侧"
           case UP: return "上方"
           case DOWN: return "下方"
           default: return "未知方向"
       }
   }
}
