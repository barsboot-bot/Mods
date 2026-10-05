export function generateModCpp(config: {
  modName: string;
  modDir: string;
  modTooltip: string;
  modPicture: string;
}): string {
  return `name = "${config.modName}";
dir = "${config.modDir}";
tooltip = "${config.modTooltip}";
picture = "${config.modPicture}";
author = "Mod Author";
overview = "${config.modTooltip}";
action = "";
actionName = "Website";
`;
}

export function generateServerDZCfg(config: {
  hostname: string;
  maxPlayers: number;
  password: string;
  adminPassword: string;
  enableWhitelist: boolean;
  battlEye: boolean;
  disablePersonalLight: boolean;
  enableDebugMonitor: boolean;
  timeAcceleration: number;
  nightTimeAcceleration: number;
  respawnTime: number;
  serverTimeAcceleration: number;
}): string {
  return `hostname = "${config.hostname}";
password = "${config.password}";
passwordAdmin = "${config.adminPassword}";
maxPlayers = ${config.maxPlayers};
verifySignatures = 2;
forceSameBuild = 1;
enableWhitelist = ${config.enableWhitelist ? 1 : 0};
battlEye = ${config.battlEye ? 1 : 0};

// ВРЕМЯ
serverTimeAcceleration = ${config.serverTimeAcceleration};
serverNightTimeAcceleration = ${config.nightTimeAcceleration};
serverTimePersistent = 0;

// РЕСПАУН
respawnTime = ${config.respawnTime};

// ЛОГИРОВАНИЕ
logAverageFps = 1;
logMemory = 1;
logPlayers = 1;
logFile = "server_console.log";
adminLogPlayerHitsOnly = 0;
adminLogPlacement = 0;
adminLogBuildActions = 0;
adminLogPlayerList = 0;

// СТЕЛС
disablePersonalLight = ${config.disablePersonalLight ? 1 : 0};
enableDebugMonitor = ${config.enableDebugMonitor ? 1 : 0};

// СИД ВРЕМЕНИ
timeAcceleration = ${config.timeAcceleration};
nightTimeAcceleration = ${config.nightTimeAcceleration};

// SAFETY ZONE
safetyZoneBehavior = 0;

// STEAM QUERY
steamQueryPort = 2304;
`;
}

export function generateInitC(): string {
  return `class CustomMission: MissionServer
{
    void CustomMission()
    {
        // Конструктор - вызывается при старте сервера
        Print("[CUSTOM] Mission initialized!");
    }
    
    override void OnInit()
    {
        super.OnInit();
        Print("[CUSTOM] OnInit called");
        
        // Загрузка кастомных настроек
        LoadCustomSettings();
    }
    
    override void OnMissionStart()
    {
        super.OnMissionStart();
        Print("[CUSTOM] Mission started!");
        
        // Кастомная логика при старте
    }
    
    override void OnMissionFinish()
    {
        super.OnMissionFinish();
        Print("[CUSTOM] Mission finished!");
    }
    
    override void OnUpdate(float timeslice)
    {
        super.OnUpdate(timeslice);
        
        // Логика, выполняемая каждый тик сервера
    }
    
    void LoadCustomSettings()
    {
        Print("[CUSTOM] Loading custom settings...");
        // Загрузка JSON конфига
    }
    
    // Спавн кастомного транспорта
    void SpawnCustomVehicle(vector pos, string vehicleType)
    {
        EntityAI vehicle = EntityAI.Cast(GetGame().CreateObject(vehicleType, pos));
        if (vehicle)
        {
            Print("[CUSTOM] Vehicle spawned: " + vehicleType);
        }
    }
    
    // Спавн зомби
    void SpawnCustomZombie(vector pos, string zombieType)
    {
        EntityAI zombie = GetGame().CreateObject(zombieType, pos);
        if (zombie)
        {
            Print("[CUSTOM] Zombie spawned: " + zombieType);
        }
    }
}

Mission CreateCustomMission(string world)
{
    return new CustomMission();
}
`;
}

export function generateTypesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<types>
    <!-- ОРУЖИЕ -->
    <type name="AKM">
        <nominal>8</nominal>
        <lifetime>28800</lifetime>
        <restock>3600</restock>
        <min>5</min>
        <quantmin>-1</quantmin>
        <quantmax>-1</quantmax>
        <cost>100</cost>
        <flags count_in_cargo="0" count_in_hoarder="0" count_in_map="1" count_in_player="0" crafted="0" deloot="0"/>
        <category name="weapons"/>
        <usage name="Military"/>
    </type>
    
    <type name="M4A1">
        <nominal>5</nominal>
        <lifetime>28800</lifetime>
        <restock>3600</restock>
        <min>3</min>
        <quantmin>-1</quantmin>
        <quantmax>-1</quantmax>
        <cost>100</cost>
        <flags count_in_cargo="0" count_in_hoarder="0" count_in_map="1" count_in_player="0" crafted="0" deloot="0"/>
        <category name="weapons"/>
        <usage name="Military"/>
        <value name="Tier3"/>
        <value name="Tier4"/>
    </type>
    
    <!-- МЕДИЦИНА -->
    <type name="BandageDressing">
        <nominal>30</nominal>
        <lifetime>14400</lifetime>
        <restock>0</restock>
        <min>20</min>
        <quantmin>-1</quantmin>
        <quantmax>-1</quantmax>
        <cost>100</cost>
        <flags count_in_cargo="0" count_in_hoarder="0" count_in_map="1" count_in_player="0" crafted="0" deloot="0"/>
        <category name="tools"/>
        <tag name="shelves"/>
        <usage name="Medic"/>
    </type>
    
    <!-- ЕДА -->
    <type name="CannedBeans">
        <nominal>25</nominal>
        <lifetime>14400</lifetime>
        <restock>0</restock>
        <min>15</min>
        <quantmin>-1</quantmin>
        <quantmax>-1</quantmax>
        <cost>100</cost>
        <flags count_in_cargo="0" count_in_hoarder="0" count_in_map="1" count_in_player="0" crafted="0" deloot="0"/>
        <category name="food"/>
    </type>
    
    <!-- ОДЕЖДА -->
    <type name="GorkaEJacket_Summer">
        <nominal>10</nominal>
        <lifetime>7200</lifetime>
        <restock>0</restock>
        <min>5</min>
        <quantmin>-1</quantmin>
        <quantmax>-1</quantmax>
        <cost>100</cost>
        <flags count_in_cargo="0" count_in_hoarder="0" count_in_map="1" count_in_player="0" crafted="0" deloot="0"/>
        <category name="clothes"/>
        <usage name="Military"/>
    </type>
</types>
`;
}

export function generateEconXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<economy>
    <flags>
        <flag name="spawnStorage" value="1"/>
        <flag name="saveStore" value="1"/>
        <flag name="debugDynamicEvents" value="0"/>
    </flags>
    
    <ce scope="ceTestRange">
        <usage name="Military"/>
        <usage name="Police"/>
        <usage name="Medic"/>
        <usage name="Farm"/>
        <usage name="Village"/>
        <usage name="Town"/>
        <usage name="Coast"/>
        <usage name="Hunting"/>
        <usage name="Industrial"/>
        <usage name="School"/>
        <usage name="Prison"/>
        <usage name="Firefighter"/>
        <usage name="Lunapark"/>
        <usage name="Seasonal"/>
        <usage name="ContaminatedArea"/>
    </ce>
    
    <defaults>
        <nominal value="50"/>
        <lifetime value="900"/>
        <min value="25"/>
        <quantmin value="-1"/>
        <quantmax value="-1"/>
        <cost value="100"/>
    </defaults>
    
    <categories>
        <category name="weapons"/>
        <category name="tools"/>
        <category name="clothes"/>
        <category name="containers"/>
        <category name="food"/>
        <category name="books"/>
    </categories>
    
    <tags>
        <tag name="floor"/>
        <tag name="shelves"/>
        <tag name="ground"/>
    </tags>
    
    <usage name="Military"/>
    <usage name="Police"/>
    <usage name="Medic"/>
    <usage name="Farm"/>
    <usage name="Village"/>
    <usage name="Town"/>
    <usage name="Coast"/>
    <usage name="Hunting"/>
    <usage name="Industrial"/>
    <usage name="School"/>
    <usage name="Prison"/>
    <usage name="Firefighter"/>
    <usage name="Lunapark"/>
    <usage name="Seasonal"/>
    <usage name="ContaminatedArea"/>
    
    <value name="Tier1"/>
    <value name="Tier2"/>
    <value name="Tier3"/>
    <value name="Tier4"/>
    <value name="Unique"/>
</economy>
`;
}

export function generateCfgGameplay(): string {
  return `{
    "version": 122,
    "general": {
        "disableBaseDamage": false,
        "disableContainerDamage": false,
        "disableRespawnDialog": false
    },
    "player": {
        "StaminaData": {
            "staminaMax": 100.0,
            "staminaWeight": 0.005,
            "staminaRunThreshold": 0.3,
            "staminaRun": 0.0,
            "sprintThreshold": 0.6,
            "sprint": 0.0,
            "sprintSwimming": 0.0,
            "sprintLadder": 0.0,
            "staminaRecoverWhileWalking": 0.0,
            "staminaRecoverWhileCrouching": 0.0,
            "staminaRecoverWhileProne": 0.0,
            "staminaRecoverWhileSitting": 0.0,
            "staminaRecoverWhileStanding": 0.0
        },
        "ShockHandlingData": {
            "shockRangeMin": 0.0,
            "shockRangeMax": 0.0,
            "shockRegen": 0.0,
            "shockRefillSpeed": 0.0,
            "shockRefillDelay": 0.0,
            "shockToHealthCoef": 0.0
        }
    },
    "worldsData": {
        "storage": {
            "used": 0
        }
    }
}
`;
}
