export interface ScriptSnippet {
  id: string;
  title: string;
  category: string;
  description: string;
  code: string;
}

export const scriptSnippets: ScriptSnippet[] = [
  {
    id: 'spawn-vehicle',
    title: 'Спавн транспорта',
    category: 'Серверные события',
    description: 'Спавн кастомного транспорта в заданной позиции при старте сервера',
    code: `// Спавн транспорта в init.c
override void OnMissionStart()
{
    super.OnMissionStart();
    
    // Спавн вертолёта на аэродроме
    vector heliPos = "4484.0 310.0 10286.0";
    EntityAI heli = GetGame().CreateObject("Mi8", heliPos);
    if (heli)
    {
        heli.SetPosition(heliPos);
        heli.SetOrientation(Vector(0, 0, 0));
        Print("[MOD] Helicopter spawned!");
    }
    
    // Спавн машины
    vector carPos = "3712.0 400.0 5988.0";
    EntityAI car = GetGame().CreateObject("OffroadHatchback", carPos);
    if (car)
    {
        CarScript.Cast(car).Fill(CarScript.FUEL_TYPE_GAS, 50.0);
        Print("[MOD] Car spawned with fuel!");
    }
}`
  },
  {
    id: 'custom-zombie',
    title: 'Кастомный зомби',
    category: 'Зомби',
    description: 'Создание кастомного класса зомби с модифицированным поведением',
    code: `// CustomZombie.c - новый файл в scripts/
class CustomZombie extends ZombieBase
{
    void CustomZombie()
    {
        // Увеличенное здоровье
        SetAllowDamage(true);
    }
    
    override void EEInit()
    {
        super.EEInit();
        
        // Увеличенная скорость
        SetMovementSpeedMultiplier(1.5);
        
        // Увеличенный урон
        SetDamage(25.0);
        
        Print("[CUSTOM] Custom zombie initialized!");
    }
    
    override void EEDamageReceived(float damage)
    {
        super.EEDamageReceived(damage);
        
        // Зомби получает только 50% урона
        // (нужно модифицировать через AgentBase)
    }
    
    override void OnDeath(int killer)
    {
        super.OnDeath(killer);
        
        // Дроп кастомного лута при смерти
        if (Math.RandomInt(0, 100) < 30) // 30% шанс
        {
            vector pos = GetPosition();
            GetGame().ObjectDelete(this);
            GetGame().CreateObject("GoldNuggetSmall", pos);
            Print("[CUSTOM] Custom zombie dropped gold!");
        }
    }
}`
  },
  {
    id: 'player-events',
    title: 'События игрока',
    category: 'Игрок',
    description: 'Обработка событий подключения и отключения игроков',
    code: `// PlayerOverrider.c - переопределение поведения игрока
modded class PlayerBase
{
    override void OnConnect()
    {
        super.OnConnect();
        
        string playerName = this.GetName();
        Print("[CONNECT] Player connected: " + playerName);
        
        // Выдать стартовый набор
        this.GetInventory().CreateInInventory("BandageDressing");
        this.GetInventory().CreateInInventory("CannedBeans");
        this.GetInventory().CreateInInventory("WaterBottle");
        
        Print("[MOD] Starter kit given to: " + playerName);
    }
    
    override void OnDisconnect()
    {
        super.OnDisconnect();
        
        string playerName = this.GetName();
        Print("[DISCONNECT] Player disconnected: " + playerName);
        
        // Сохранить статистику
        SavePlayerStats(playerName);
    }
    
    void SavePlayerStats(string playerName)
    {
        // Сохранение в файл или БД
        FileHandle file = OpenFile("$profile:player_stats.txt", FileMode.WRITE);
        if (file != 0)
        {
            FPrintln(file, playerName + " disconnected at " + GetGame().GetTime());
            CloseFile(file);
        }
    }
}`
  },
  {
    id: 'weather-system',
    title: 'Кастомная погода',
    category: 'Окружение',
    description: 'Управление погодой и временем суток на сервере',
    code: `// WeatherController.c - управление погодой
class WeatherController
{
    static ref WeatherController m_Instance;
    
    void WeatherController()
    {
        m_Instance = this;
    }
    
    static WeatherController GetInstance()
    {
        if (!m_Instance)
            m_Instance = new WeatherController();
        return m_Instance;
    }
    
    void SetStorm()
    {
        Weather weather = GetGame().GetWeather();
        
        weather.GetOvercast().Set(1.0, 0, 0);
        weather.GetRain().Set(1.0, 0, 0);
        weather.GetFog().Set(0.0, 0, 0);
        weather.GetWindMagnitudeParams().Set(20.0, 0, 0);
        
        Print("[WEATHER] Storm activated!");
    }
    
    void SetClearSky()
    {
        Weather weather = GetGame().GetWeather();
        
        weather.GetOvercast().Set(0.0, 0, 0);
        weather.GetRain().Set(0.0, 0, 0);
        weather.GetFog().Set(0.0, 0, 0);
        
        Print("[WEATHER] Clear sky activated!");
    }
    
    void SetFog(float density)
    {
        Weather weather = GetGame().GetWeather();
        weather.GetFog().Set(density, 0, 0);
        
        Print("[WEATHER] Fog density: " + density);
    }
    
    void SetTime(float hour)
    {
        GetGame().GetWorld().SetDate(2023, 6, 15, hour, 0);
        Print("[WEATHER] Time set to: " + hour + ":00");
    }
}`
  },
  {
    id: 'custom-weapon',
    title: 'Кастомное оружие',
    category: 'Оружие',
    description: 'Пример создания модифицированного оружия с кастомными характеристиками',
    code: `// CustomWeapon.c - модифицированное оружие
modded class Weapon_Base
{
    override void EEInit()
    {
        super.EEInit();
    }
    
    override void OnStoreLoad(ParamsReadContext ctx, int saveVersion)
    {
        super.OnStoreLoad(ctx, saveVersion);
    }
}

// Кастомный автомат с повышенным уроном
class CustomAKM extends AKM
{
    override void EEInit()
    {
        super.EEInit();
        Print("[CUSTOM] Custom AKM initialized!");
    }
    
    // Переопределение урона через конфиг (config.cpp)
    // В конфиге указываем:
    // damage = 45; // вместо стандартных 35
    // recoil[] = {0.05, 0.05}; // сниженный откат
    // dispersion = 0.5; // улучшенная точность
}

// Кастомный магазин увеличенной ёмкости
class CustomMagazine extends Magazine_AKM_30Rnd
{
    override void EEInit()
    {
        super.EEInit();
        // Ёмкость задаётся в config.cpp:
        // count = 60; // 60 патронов вместо 30
    }
}

// Конфиг (config.cpp):
// class CustomAKM: AKM
// {
//     displayName = "Custom AKM";
//     damage = 45;
//     magazineType = "CustomMagazine";
//     recoil[] = {0.05, 0.05};
// };`
  },
  {
    id: 'trading-system',
    title: 'Система торговли',
    category: 'Экономика',
    description: 'Простая система торговли между игроками через NPC',
    code: `// TradingSystem.c - базовая система торговли
class TradingSystem
{
    // Структура предмета для торговли
    ref array<ref TradeItem> m_TradeItems;
    
    void TradingSystem()
    {
        m_TradeItems = new array<ref TradeItem>();
        InitTradeItems();
    }
    
    void InitTradeItems()
    {
        // Добавляем предметы для торговли
        m_TradeItems.Insert(new TradeItem("AKM", 100));
        m_TradeItems.Insert(new TradeItem("M4A1", 150));
        m_TradeItems.Insert(new TradeItem("BandageDressing", 5));
        m_TradeItems.Insert(new TradeItem("CannedBeans", 3));
        m_TradeItems.Insert(new TradeItem("WaterBottle", 2));
    }
    
    // Проверка наличия предмета у игрока
    bool HasItem(PlayerBase player, string itemType, int count)
    {
        int found = 0;
        array<EntityAI> items = new array<EntityAI>();
        player.GetInventory().EnumerateInventory(
            InventoryTraversalType.PREORDER, items);
        
        foreach (EntityAI item : items)
        {
            if (item.IsKindOf(itemType))
                found++;
        }
        
        return found >= count;
    }
    
    // Покупка предмета
    bool BuyItem(PlayerBase player, string itemType, int price)
    {
        // Проверяем наличие валюты (например, золотых nuggets)
        if (!HasItem(player, "GoldNuggetSmall", price))
        {
            SendMessage(player, "Недостаточно золотых самородков!");
            return false;
        }
        
        // Удаляем валюту
        RemoveItems(player, "GoldNuggetSmall", price);
        
        // Создаём купленный предмет
        player.GetInventory().CreateInInventory(itemType);
        
        SendMessage(player, "Предмет " + itemType + " куплен!");
        return true;
    }
    
    void RemoveItems(PlayerBase player, string itemType, int count)
    {
        int removed = 0;
        array<EntityAI> items = new array<EntityAI>();
        player.GetInventory().EnumerateInventory(
            InventoryTraversalType.PREORDER, items);
        
        foreach (EntityAI item : items)
        {
            if (removed >= count) break;
            if (item.IsKindOf(itemType))
            {
                GetGame().ObjectDelete(item);
                removed++;
            }
        }
    }
    
    void SendMessage(PlayerBase player, string msg)
    {
        // Отправка сообщения игроку
        Param1<string> param = new Param1<string>(msg);
        GetGame().RPCSingleParam(player, ERPCs.RPC_USER_ACTION_MESSAGE, param, true, player.GetIdentity());
    }
}

class TradeItem
{
    string itemType;
    int price;
    
    void TradeItem(string type, int p)
    {
        itemType = type;
        price = p;
    }
}`
  },
  {
    id: 'safezone',
    title: 'Зона безопасности',
    category: 'Территории',
    description: 'Создание зоны безопасности где запрещено PvP и кражи',
    code: `// SafeZone.c - система зон безопасности
class SafeZone
{
    static const float SAFE_RADIUS = 50.0; // Радиус зоны
    static ref array<vector> m_SafeZonePositions;
    
    void SafeZone()
    {
        m_SafeZonePositions = new array<vector>();
        
        // Добавляем позиции безопасных зон (Trader, Balota Airstrip)
        m_SafeZonePositions.Insert(Vector(4484.0, 310.0, 10286.0)); // Balota
        m_SafeZonePositions.Insert(Vector(12942.0, 15.0, 10068.0)); // Severograd
        m_SafeZonePositions.Insert(Vector(3712.0, 400.0, 5988.0));  // Custom
    }
    
    // Проверка, находится ли позиция в безопасной зоне
    static bool IsInSafeZone(vector pos)
    {
        foreach (vector zonePos : m_SafeZonePositions)
        {
            float dist = vector.Distance(pos, zonePos);
            if (dist <= SAFE_RADIUS)
                return true;
        }
        return false;
    }
    
    // Обработка урона в безопасной зоне
    static void OnDamageReceived(EntityAI entity, float damage)
    {
        if (entity.IsKindOf("SurvivorBase"))
        {
            vector pos = entity.GetPosition();
            if (IsInSafeZone(pos))
            {
                // Отменяем урон в безопасной зоне
                Print("[SAFEZONE] Damage blocked in safe zone!");
                return;
            }
        }
    }
    
    // Уведомление игрока о входе в зону
    static void CheckPlayerZone(PlayerBase player)
    {
        vector pos = player.GetPosition();
        bool inSafe = IsInSafeZone(pos);
        
        if (inSafe)
        {
            // Показать уведомление
            Param1<string> param = new Param1<string>("Вы находитесь в безопасной зоне");
            GetGame().RPCSingleParam(player, ERPCs.RPC_USER_ACTION_MESSAGE, param, true, player.GetIdentity());
        }
    }
}`
  },
  {
    id: 'custom-crafting',
    title: 'Кастомный крафт',
    category: 'Крафт',
    description: 'Добавление новых рецептов крафта',
    code: `// CustomRecipes.c - кастомные рецепты крафта
modded class PluginRecipesManager
{
    override void RegisterRecipies()
    {
        super.RegisterRecipies();
        
        // Рецепт: Создать факел из палки и тряпки
        RegisterRecipe(new CraftTorch);
        
        // Рецепт: Улучшенная аптечка
        RegisterRecipe(new CraftMedkit);
        
        // Рецепт: Кастомное оружие
        RegisterRecipe(new CraftCustomWeapon);
    }
}

// Рецепт факела
class CraftTorch extends RecipeBase
{
    override void Init()
    {
        m_Name = "Создать факел";
        m_IsInstaRecipe = false;
        m_AnimationLength = 1.5;
        m_Specialty = 0;
        
        // Ингредиенты
        // Slot 0: Длинная палка
        InsertIngredient(0, "LongWoodenStick");
        // Slot 1: Тряпка
        InsertIngredient(1, "Rag");
        
        // Результат
        m_Result[0] = "Torch";
        m_ResultZero[0] = false;
        
        // Условие
        m_MinDamageIngredient[0] = -1;
        m_MaxDamageIngredient[0] = -1;
        m_MinQuantityIngredient[0] = -1;
        m_MaxQuantityIngredient[0] = -1;
    }
    
    override string GetDisplayString()
    {
        return "Создание факела из палки и тряпки";
    }
}

// Рецепт улучшенной аптечки
class CraftMedkit extends RecipeBase
{
    override void Init()
    {
        m_Name = "Создать аптечку";
        m_IsInstaRecipe = false;
        m_AnimationLength = 3.0;
        m_Specialty = 0;
        
        // Нужно 3 бинта
        InsertIngredient(0, "BandageDressing");
        InsertIngredient(0, "BandageDressing");
        InsertIngredient(0, "BandageDressing");
        // И 1 антибиотик
        InsertIngredient(1, "TetracyclineAntibiotics");
        
        m_Result[0] = "FirstAidKit";
        m_ResultZero[0] = false;
    }
    
    override string GetDisplayString()
    {
        return "Создание аптечки из бинтов и антибиотиков";
    }
}`
  }
];

export const categories = [...new Set(scriptSnippets.map(s => s.category))];
