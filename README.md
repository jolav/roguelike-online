<br>

![image](https://github.com/jolav/roguelike-online/blob/main/www/_public/images/web.webp?raw=true) 

![License](https://img.shields.io/badge/License-%20GNU%20AGPLv3%20-brightgreen)  


[TEST PROLOGUE ONLINE](https://prologue.roguelike.online/)

## PROLOGUE MILESTONE  

![Game](https://img.shields.io/badge/Version-0.12-orange.svg)  

- [X] **Start**  
- [X] **Prologue.0.1 Setting Up Client-Server**  
- [X] **Prologue.0.2 Server runs/run loop + Basic Authentication**  
- [X] **Prologue.0.3 Generate and Draw Basic Map**  
- [X] **Prologue.0.4 Generate Shelter Level**  
- [X] **Prologue.0.5 Drawing and Moving around @**  
- [X] **Prologue.0.6 Array of actions + movement animations**  
- [X] **Prologue.0.7 Turn Time System**  
- [X] **Prologue.0.8 Camera**  
- [X] **Prologue.0.9 Field of View**  
- [X] **Prologue.0.10 Move Creatures Randomly**  
- [X] **Prologue.0.11 Enemies AI**  
- [X] **Prologue.0.12 Creating UI**  
- [ ] **Prologue History**  
- [ ] **Prologue Melee**  
- [ ] **Prologue Data Files**  
- [ ] **Prologue Save/Load run**  
- [ ] **Prologue Inventory and items**  
- [ ] **Prologue Ranged Combat**  
- [ ] **Prologue Generating Shelter**  
- [ ] **Prologue Ilumination**  
- [ ] **Prologue Multiple Shelter Levels**  
- [ ] **Prologue.1.0 Leaving the Shelter. Minimal Full Playable version**  

**CLIENT**  
- [X] **choose a colors palette**  
- [ ] **history improved with loots**  
- [ ] **Sound effects**  
- [ ] **Turn counter into datetime**  
- [ ] **Use modal for dialogs**  
- [ ] **help modal showing controls settings and config**  
- [ ] **Center camera if is greater than map**  
- [ ] **render order, tiles-corpses-items-foes-player**  
- [X] **only pass turn if action is really done, no effect actions**  
- [ ] **damage tooltips**  
- [X] **on key pressed down ,movement at constant speed**  
- [ ] **unselect targets dead or not in LOS**  
- [ ] **cumulative history, instead of x lines, (x) action**  
- [ ] **simulate nuclear shelter collapse**  
- [ ] **markers where noise is heard**  
- [ ] **markings on the edge of the map indicating quest directions**  
- [ ] **dummy items**  
- [ ] **Tilesets as well as ascii**  
- [ ] **two letter names on ascii ??**  
- [ ] **multiple turn same entity, manage it**  
- [ ] **change order, first player animation then draw centering camera**  


**CLIENT ANIMATIONS**  
- [X] **Movement ??**  
- [ ] **Melee**  
- [ ] **Ranged**  
- [ ] **Rumble**  
- [ ] **Animations only in a limited map zone, better performance**  

**CLIENT MOUSE**  
- [ ] **move support**  
- [ ] **Show tooltip with stats on mouse over map/entities**  
- [ ] **Move long distance using mouse**   
- [ ] **Select tile and foe with mouse**  

**CLIENT SETTINGS**  
- [X] **Choose/Random player name at start**  
- [X] **Check client is not flooding core with commands.one each Xms?**  
- [ ] **settings: resize window, custom controls, change scale...**  
- [ ] **Player can modify ppp size 12/16/24...**  
- [ ] **resize map on windows resize**  

**MAPS**  
- [X] **random pj start point instead center**  
- [ ] **non-rectangular rooms**  
- [ ] **check all map is connected**  
- [ ] **wide corridors**  
- [ ] **Put pillars in large rooms**  
- [ ] **add furniture**  
- [ ] **open/close doors**  
- [ ] **lights, ilumination**  

**SERVER**  
- [X] **Dont trust any client data**  
- [X] **Check client is not flooding server with commands.min each Xms?**  
- [X] **seeds for reproducible runs**  
- [X] **discard api request by Methods POST...**  
- [ ] **One turn equals 10,15,30 or 60 seg**  
- [ ] **manage runs, set a maximun**  
- [ ] **save in files and delete runs from memory after some inactivity**  
- [ ] **Lock runs while are active solving a turn**  
- [ ] **remove hardcoded data**  
- [ ] **calculate server response time**  
- [ ] **add fov component, losDistance**  

**OPTIONALS FEATURES**   
- [ ] **test non-square fonts**  
- [ ] **bypassing columns increase movement cost**  
- [ ] **mark visited items like visited ??**   
- [ ] **Show PJ position coords maybe as a skill**  
- [ ] **info about criatures/npc must be unblocked**  
- [ ] **R highligths all criatures/npcs same color except the one selected**  
- [ ] **minigames open lock, sudoku, hacking, brute force**  
- [ ] **mini screen for shooting from far distance**  
- [ ] **Grid centered on x,y instead of x+0.5,y+0.5 avoiding offsets**  
- [ ] **Map Prefabs**  
- [ ] **Autoexplore**  
- [ ] **Stats**  
- [ ] **Experience and levels**  
- [ ] **Facing last direction, LOS radius behind at 1/2**  
- [ ] **Hall of Fame**  

**BUGS**  
- [X] **to avoid undefined, must send to client all actions and entities**  
- [X] **Player pumps dont return loop to client and enter empty tiles can fail**

## **Acknowledgment**

All the artwork is either public domain or released under a variety of Creative Commons licenses. To determine the copyright status of any of the artwork, consult the [Artwork Copyright File](https://github.com/jolav/roguelike-online/blob/main/artwork.txt)

