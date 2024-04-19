![Game](https://img.shields.io/badge/Prologue-0.1.5-orange.svg)  
![License](https://img.shields.io/badge/license-%20GNU%20AGPLv3%20-brightgreen)  

## **[Play roguelike.online](https://roguelike.online)**  

## CONTROLS  

NUMPAD  
"1" -> DOWNLEFT  
"2" -> DOWN  
"3" -> DOWNRIGHT  
"4" -> LEFT  
"5" -> SKIP  
"6" -> RIGHT  
"7" -> UPLEFT  
"8" -> UP  
"9" -> UPRIGHT  

KEYBOARD  
"b" -> DOWNLEFT  
"j" -> DOWN  
"n" -> DOWNRIGHT  
"h" -> LEFT  
"t" -> SKIP  
"l" -> RIGHT  
"y" -> UPLEFT  
"k" -> UP  
"u" -> UPRIGHT

"q" -> LOOT  
"1" -> EAT  
"3" -> HEAL  
"f" -> FIRE  
"r" -> SELECT  
  
## PROLOGUE 1.0.0 MILESTONE 

- [X] **Prologue.0.1.5 History minor change**  
- [X] **Prologue.0.1.4 Refactoring: history has its own class/object**  
- [X] **Prologue.0.1.3 movement at constant speed keeping key pressed down**  
- [X] **Prologue.0.1.2 Auto unselect targets**  
- [X] **Prologue.0.1.1 Colors Palette + History improved + ensure render order + unicode use**  
- [X] **Prologue.0.1.0 Minimal full playable version**   
- [X] **Prologue.0.0.14 Leaving The Shelter**
- [X] **Prologue.0.0.13 Ranged Combat**  
- [X] **Prologue.0.0.12 Inventory and items**  
- [X] **Prologue.0.0.11 Creating UI**  
- [X] **Prologue.0.0.10 Melee**  
- [X] **Prologue.0.0.9 Turn Time System**  
- [X] **Prologue.0.0.8 Moving Enemies**  
- [X] **Prologue.0.0.7 Placing Enemies**  
- [X] **Prologue.0.0.6 Generating Shelter**  
- [X] **Prologue.0.0.5 Field of View**  
- [X] **Prologue.0.0.4 Camera**  
- [X] **Prologue.0.0.3 Basic Map**   
- [X] **Prologue.0.0.2 Moving around @**  
- [X] **Prologue.0.0.1 Setting Up Client-Core Relation**  
- [X] **Prologue.0.0.0 Start**  

- **CLIENT**  
- [X] **use colors palette**  
- [X] **history improved with loots**  
- [ ] **Sound effects**  
- [X] **Turn counter into datetime**  
- [ ] **change alert for modal**  
- [X] **Center camera if is greater than map**  
- [X] **render order, tiles-corpses-items-foes-player**  
- [X] **only pass turn if action is really done, no effect actions**  
- [ ] **damage tooltips**  
- [ ] **melee animations**  
- [X] **on key pressed down ,movement at constant speed**  
- [X] **Simulate Ping to server**  
- [X] **unselect targets dead or not in LOS**  
- [ ] **array with npcs movements/actions for slow turn animation**  
- **CLIENT MOUSE**  
- [ ] **move support**  
- [ ] **Show tooltip with stats on mouse over map/entities**  
- [ ] **Move long distance using mouse**   
- [ ] **Select tile and foe with mouse**  
- **CLIENT SETTINGS**  
- [ ] **help modal showing controls settings and config**  
- [ ] **settings: resize window, custom controls, change scale...**  
- [ ] **Player can modify ppp size 12/16/24...**  
- [ ] **resize map on windows resize**  
- **GAME FEATURES**  
- [ ] **Restrict data to client**  
- [ ] **Multiple Shelter Levels**  
- [ ] **Choose/Random player name at start**  
- [ ] **simulate nuclear shelter collapse**  
- [ ] **markers where noise is heard**  
- [ ] **markings on the edge of the map indicating quest directions**  
- [ ] **dummy items**  
- [X] **One turn equals 10,15,30 or 60 seg**  
- **MAPS**  
- [X] **random pj start point instead center**  
- [ ] **Remove dead end corridors ??**  
- [ ] **check all map is connected**  
- [ ] **wide corridors**  
- [ ] **Put pillars in large rooms**  
- [ ] **add furniture**  
- [ ] **open/close doors**  
- [ ] **lights, ilumination**  
- **REFACTORING**  
- [X] **move history into its own class/object**  
- [ ] **remove hardcoded data for external files**  
- **OPTIONALS**   
- [ ] **mark visited items like visited ??**   
- [ ] **Show PJ position- maybe as a skill**  
- [ ] **move, melee and ranged combat animations**  
- [ ] **info about criatures/npc must be unblocked**  
- [ ] **R highligths all criatures/npcs same color except the one selected**  
- [ ] **minigames open lock, sudoku, hacking, brute force**  
- [ ] **mini screen for shooting from far distance**  
- [ ] **Grid centered on x,y instead of x+0.5,y+0.5 avoiding offsets**  
- [X] **two letter names on ascii**  
- [ ] **Map Prefabs**  
- [ ] **Autoexplore**  
- [ ] **Stats**  
- [ ] **Experience and levels**  
- **DISCARDED IDEAS AT THE MOMENT**  
- [ ] **Directional FOV**  
- [ ] **Client mini Zoom map**  
- [ ] **Each input movement is queued and previewed on client**   
- [ ] **convert prologue landing page into a modal once game is started**  
- [ ] **Tilesets as well as ascii**  
- **SERVER Planned for a later release**  
- [ ] **Authentication**  
- [ ] **Save/Load runs**  
- [ ] **seeds for reproducible runs**  
- [ ] **Ping**  
- [ ] **Data Files**  
- [ ] **Players account**  
- [ ] **incremental views to reduce bandwith**  
- [ ] **websockets instead API ?**  
- [ ] **Turn Based Multi Player Combat Arena Test**    
- **BUGS**  
- [ ] **npcs attack each other if they are of different types or feature??**  
- [ ] **some maps smaller than camera breaks**  


## **Acknowledgment**

All the artwork is either public domain or released under a variety of Creative Commons licenses. To determine the copyright status of any of the artwork, consult the [Artwork Copyright File](https://github.com/jolav/roguelike-online/blob/main/artwork.txt)


