/**
 * 机器人智能操作系统
 */
//% weight=100 color=#ff6b35 icon="\uf544"
namespace RobotController {
    
    // 机器人状态管理
    let robotBusy = false
    let currentTask = ""
    let taskProgress = 0
    
    /**
     * 基础移动控制
     */
    //% blockId=robot_move_forward
    //% block="机器人向前移动 %steps 步"
    //% steps.min=1 steps.max=50 steps.defl=5
    //% group="基础移动"
    //% weight=100
    export function moveForward(steps: number): void {
        if (robotBusy) {
            player.say("机器人正忙，请稍后...")
            return
        }
        
        robotBusy = true
        currentTask = "向前移动"
        
        for (let i = 0; i < steps; i++) {
            agent.move(FORWARD, 1)
            loops.pause(200)
            taskProgress = Math.round((i + 1) / steps * 100)
        }
        
        player.say(`机器人完成${steps}步移动`)
        robotBusy = false
        currentTask = ""
    }
    
    //% blockId=robot_turn_and_move
    //% block="机器人转向 %direction 并移动 %steps 步"
    //% direction.defl=TurnDirection.Left
    //% steps.min=1 steps.max=20 steps.defl=3
    //% group="基础移动"
    //% weight=90
    export function turnAndMove(direction: TurnDirection, steps: number): void {
        agent.turn(direction)
        loops.pause(500)
        moveForward(steps)
    }
    
    //% blockId=robot_navigate_to_player
    //% block="机器人返回到玩家身边"
    //% group="基础移动"
    //% weight=80
    export function navigateToPlayer(): void {
        agent.teleportToPlayer()
        player.say("机器人已返回身边")
    }
    
    /**
     * 建造与挖掘
     */
    //% blockId=robot_build_wall
    //% block="机器人建造墙壁 长度 %length 高度 %height 使用 %blockType"
    //% length.min=1 length.max=20 length.defl=5
    //% height.min=1 height.max=10 height.defl=3
    //% blockType.defl=Block.Stone
    //% group="建造功能"
    //% weight=100
    export function buildWall(length: number, height: number, blockType: Block): void {
        if (robotBusy) {
            player.say("机器人正在执行其他任务...")
            return
        }
        
        robotBusy = true
        currentTask = "建造墙壁"
        
        // 设置机器人携带的方块
        agent.setItem(blockType, 64, 1)
        agent.setSlot(1)
        
        const startPos = agent.getPosition()
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < length; x++) {
                agent.place(DOWN)
                if (x < length - 1) {
                    agent.move(FORWARD, 1)
                }
                taskProgress = Math.round(((y * length + x + 1) / (length * height)) * 100)
            }
            
            // 回到起始位置并上升一层
            if (y < height - 1) {
                agent.move(BACK, length - 1)
                agent.move(UP, 1)
            }
        }
        
        player.say(`墙壁建造完成！尺寸: ${length}x${height}`)
        robotBusy = false
        currentTask = ""
    }
    
    //% blockId=robot_build_house
    //% block="机器人建造房屋 大小 %size"
    //% size.min=3 size.max=15 size.defl=5
    //% group="建造功能"
    //% weight=90
    export function buildHouse(size: number): void {
        if (robotBusy) return
        
        robotBusy = true
        currentTask = "建造房屋"
        
        // 准备建材
        agent.setItem(COBBLESTONE, 64, 1)
        agent.setItem(PLANKS_OAK, 64, 2)
        agent.setItem(GLASS, 64, 3)
        agent.setItem(OAK_DOOR, 1, 4)
        
        // 建造地基
        buildFoundation(size)
        
        // 建造墙壁
        buildHouseWalls(size)
        
        // 建造屋顶
        buildRoof(size)
        
        // 添加门和窗
        addDoorAndWindows(size)
        
        player.say(`房屋建造完成！大小: ${size}x${size}`)
        robotBusy = false
        currentTask = ""
    }
    
    //% blockId=robot_clear_area
    //% block="机器人清理区域 %width x %length x %depth"
    //% width.min=1 width.max=20 width.defl=5
    //% length.min=1 length.max=20 length.defl=5
    //% depth.min=1 depth.max=10 depth.defl=3
    //% group="挖掘功能"
    //% weight=100
    export function clearArea(width: number, length: number, depth: number): void {
        if (robotBusy) return
        
        robotBusy = true
        currentTask = "清理区域"
        
        let blocksCleared = 0
        const totalBlocks = width * length * depth
        
        for (let y = 0; y < depth; y++) {
            for (let z = 0; z < length; z++) {
                for (let x = 0; x < width; x++) {
                    agent.destroy(DOWN)
                    agent.collectAll()
                    blocksCleared++
                    
                    if (x < width - 1) {
                        agent.move(FORWARD, 1)
                    }
                    
                    taskProgress = Math.round((blocksCleared / totalBlocks) * 100)
                    loops.pause(100)
                }
                
                if (z < length - 1) {
                    agent.move(RIGHT, 1)
                    agent.move(BACK, width - 1)
                }
            }
            
            if (y < depth - 1) {
                agent.move(DOWN, 1)
                agent.move(LEFT, length - 1)
            }
        }
        
        player.say(`区域清理完成！清理了 ${blocksCleared} 个方块`)
        robotBusy = false
        currentTask = ""
    }
    
    /**
     * 农业自动化
     */
    //% blockId=robot_create_farm
    //% block="机器人创建农场 大小 %size 种植 %cropType"
    //% size.min=3 size.max=15 size.defl=7
    //% cropType.defl=Item.Seeds
    //% group="农业自动化"
    //% weight=100
    export function createFarm(size: number, cropType: Item): void {
        if (robotBusy) return
        
        robotBusy = true
        currentTask = "创建农场"
        
        // 准备农业用品
        agent.setItem(DIRT, 64, 1)
        agent.setItem(cropType, 64, 2)
        agent.setItem(WATER_BUCKET, 1, 3)
        
        // 创建农田
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
                
                // 添加水源（每4格一个）
                if (x % 4 === 0 && z % 4 === 0) {
                    agent.setSlot(3)
                    agent.interact(DOWN)
                }
                
                if (z < size - 1) {
                    agent.move(FORWARD, 1)
                }
                
                taskProgress = Math.round(((x * size + z + 1) / (size * size)) * 100)
            }
            
            if (x < size - 1) {
                agent.move(RIGHT, 1)
                agent.move(BACK, size - 1)
            }
        }
        
        player.say(`农场创建完成！大小: ${size}x${size}`)
        robotBusy = false
        currentTask = ""
    }
    
    //% blockId=robot_harvest_crops
    //% block="机器人收割农作物 范围 %range"
    //% range.min=3 range.max=15 range.defl=7
    //% group="农业自动化"
    //% weight=90
    export function harvestCrops(range: number): void {
        if (robotBusy) return
        
        robotBusy = true
        currentTask = "收割农作物"
        
        let harvestedCount = 0
        
        for (let x = 0; x < range; x++) {
            for (let z = 0; z < range; z++) {
                // 检测是否有成熟作物
                if (agent.detect(AgentDetection.Block, DOWN)) {
                    agent.destroy(DOWN)
                    agent.collectAll()
                    harvestedCount++
                    
                    // 重新种植
                    agent.till(DOWN)
                    agent.place(DOWN)
                }
                
                if (z < range - 1) {
                    agent.move(FORWARD, 1)
                }
                
                taskProgress = Math.round(((x * range + z + 1) / (range * range)) * 100)
            }
            
            if (x < range - 1) {
                agent.move(RIGHT, 1)
                agent.move(BACK, range - 1)
            }
        }
        
        player.say(`收割完成！收获了 ${harvestedCount} 个作物`)
        robotBusy = false
        currentTask = ""
    }
    
    /**
     * 探索与收集
     */
    //% blockId=robot_explore_and_collect
    //% block="机器人探索并收集资源 半径 %radius"
    //% radius.min=5 radius.max=20 radius.defl=10
    //% group="探索收集"
    //% weight=100
    export function exploreAndCollect(radius: number): void {
        if (robotBusy) return
        
        robotBusy = true
        currentTask = "探索收集"
        
        const startPos = agent.getPosition()
        let itemsCollected = 0
        
        // 螺旋式探索模式
        let direction = 0 // 0:北 1:东 2:南 3:西
        let steps = 1
        let stepCount = 0
        
        for (let i = 0; i < radius * 4; i++) {
            for (let j = 0; j < steps; j++) {
                // 收集当前位置的物品
                agent.collectAll()
                
                // 如果检测到有价值的方块，进行挖掘
                if (isValuableBlock()) {
                    agent.destroy(DOWN)
                    agent.collectAll()
                    itemsCollected++
                }
                
                // 移动到下一个位置
                moveInDirection(direction)
                taskProgress = Math.round((i / (radius * 4)) * 100)
                loops.pause(200)
            }
            
            // 改变方向
            agent.turn(TurnDirection.Right)
            direction = (direction + 1) % 4
            
            // 每两次改变方向增加步数
            if (i % 2 === 1) {
                steps++
            }
        }
        
        // 返回起始位置
        agent.teleportToPlayer()
        
        player.say(`探索完成！收集了 ${itemsCollected} 个有价值的物品`)
        robotBusy = false
        currentTask = ""
    }
    
    //% blockId=robot_mine_shaft
    //% block="机器人挖掘矿井 深度 %depth"
    //% depth.min=5 depth.max=30 depth.defl=15
    //% group="探索收集"
    //% weight=90
    export function mineShaft(depth: number): void {
        if (robotBusy) return
        
        robotBusy = true
        currentTask = "挖掘矿井"
        
        let oresFound = 0
        
        // 建造楼梯式矿井
        for (let i = 0; i < depth; i++) {
            // 向下挖掘
            agent.destroy(DOWN)
            agent.move(DOWN, 1)
            
            // 检查周围是否有矿物
            const directions = [FORWARD, BACK, LEFT, RIGHT]
            for (let dir of directions) {
                if (agent.detect(AgentDetection.Block, dir)) {
                    agent.destroy(dir)
                    if (isOreBlock()) {
                        oresFound++
                    }
                    agent.collectAll()
                }
            }
            
            // 放置梯子确保能返回
            agent.place(UP)
            
            taskProgress = Math.round(((i + 1) / depth) * 100)
            loops.pause(300)
        }
        
        // 返回地面
        for (let i = 0; i < depth; i++) {
            agent.move(UP, 1)
        }
        
        player.say(`矿井挖掘完成！深度: ${depth}, 发现矿物: ${oresFound}`)
        robotBusy = false
        currentTask = ""
    }
    
    /**
     * 状态查询与控制
     */
    //% blockId=robot_get_status
    //% block="获取机器人状态"
    //% group="状态控制"
    //% weight=100
    export function getRobotStatus(): void {
        const pos = agent.getPosition()
        const orientation = agent.getOrientation()
        
        player.say(`机器人状态报告:`)
        player.say(`位置: ${pos.toString()}`)
        player.say(`朝向: ${orientation}`)
        player.say(`是否忙碌: ${robotBusy ? "是" : "否"}`)
        player.say(`当前任务: ${currentTask || "无"}`)
        player.say(`任务进度: ${taskProgress}%`)
    }
    
    //% blockId=robot_stop_task
    //% block="停止机器人当前任务"
    //% group="状态控制"
    //% weight=90
    export function stopCurrentTask(): void {
        robotBusy = false
        currentTask = ""
        taskProgress = 0
        player.say("机器人任务已停止")
    }
    
    //% blockId=robot_emergency_return
    //% block="紧急召回机器人"
    //% group="状态控制"
    //% weight=80
    export function emergencyReturn(): void {
        robotBusy = false
        currentTask = ""
        taskProgress = 0
        agent.teleportToPlayer()
        player.say("机器人紧急召回完成")
    }
    
    /**
     * 辅助函数
     */
    function buildFoundation(size: number): void {
        agent.setSlot(1) // 使用鹅卵石
        for (let x = 0; x < size; x++) {
            for (let z = 0; z < size; z++) {
                agent.place(DOWN)
                if (z < size - 1) {
                    agent.move(FORWARD, 1)
                }
            }
            if (x < size - 1) {
                agent.move(RIGHT, 1)
                agent.move(BACK, size - 1)
            }
        }
    }
    
    function buildHouseWalls(size: number): void {
        agent.setSlot(2) // 使用橡木板
        
        // 建造四面墙
        for (let wall = 0; wall < 4; wall++) {
            for (let i = 0; i < size; i++) {
                for (let height = 1; height <= 3; height++) {
                    agent.move(UP, 1)
                    agent.place(DOWN)
                }
                agent.move(DOWN, 3)
                if (i < size - 1) {
                    agent.move(FORWARD, 1)
                }
            }
            agent.turn(TurnDirection.Right)
        }
    }
    
    function buildRoof(size: number): void {
        agent.move(UP, 4)
        agent.setSlot(2) // 使用橡木板
        
        for (let x = 0; x < size; x++) {
            for (let z = 0; z < size; z++) {
                agent.place(DOWN)
                if (z < size - 1) {
                    agent.move(FORWARD, 1)
                }
            }
            if (x < size - 1) {
                agent.move(RIGHT, 1)
                agent.move(BACK, size - 1)
            }
        }
    }
    
    function addDoorAndWindows(size: number): void {
        // 添加门
        agent.move(DOWN, 3)
        agent.setSlot(4) // 使用门
        agent.place(FORWARD)
        
        // 添加窗户
        agent.setSlot(3) // 使用玻璃
        agent.move(UP, 1)
        agent.move(LEFT, 1)
        agent.place(FORWARD)
        agent.move(RIGHT, 2)
        agent.place(FORWARD)
    }
    
    function isValuableBlock(): boolean {
        // 检测有价值的方块（金、铁、钻石等）
        return agent.inspect(AgentInspection.Block, DOWN) === GOLD_ORE ||
               agent.inspect(AgentInspection.Block, DOWN) === IRON_ORE ||
               agent.inspect(AgentInspection.Block, DOWN) === DIAMOND_ORE ||
               agent.inspect(AgentInspection.Block, DOWN) === COAL_ORE
    }
    
    function isOreBlock(): boolean {
        // 检测是否为矿物方块
        const blockType = agent.inspect(AgentInspection.Block, FORWARD)
        return blockType === GOLD_ORE || blockType === IRON_ORE || 
               blockType === DIAMOND_ORE || blockType === COAL_ORE ||
               blockType === LAPIS_ORE || blockType === EMERALD_ORE
    }
    
    function moveInDirection(direction: number): void {
        switch (direction) {
            case 0: // 北
                agent.move(FORWARD, 1)
                break
            case 1: // 东
                agent.move(RIGHT, 1)
                break
            case 2: // 南
                agent.move(BACK, 1)
                break
            case 3: // 西
                agent.move(LEFT, 1)
                break
        }
    }
}
