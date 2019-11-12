# ktbgame

Revolution No 9ine's game project for DMC 1000 (Foundations of Digital Media) at UC, Fall 2019

## Installation
Follow these instructions to set up the game on your own computer. The game should run on any OS, but I am on Mac, so the Windows instructions might not be perfect. (The game should also work fine on Linux, but I'm not going to provide Linux-specific instructions most of the time; if you're savvy enough to use Linux, you probably don't need as much help from me.)

### Prerequisites
Before you can run this game on your computer, there's some software you will need. **Windows users:** Unless your computer is literally 10+ years old, use the "64-bit installer" links, not the 32-bit links.

* [GitHub Desktop](https://desktop.github.com) (once you have installed it, be sure to login to your GitHub account)
    * (If you're experienced with Git, you can use the command-line or another Git client; however, all instructions in this guide will be tailored to GitHub Desktop.)
* [Node.js](https://nodejs.org/en/download/) (stick with "LTS"; don't select "Current")
* [Tiled map editor](https://thorbjorn.itch.io/tiled) (they'll try to get you to donate when you click Download, but you can hit "No thanks, just take me to the downloads" to get it for free)

If you plan to work on game art, you might want some art software installed. If you have Photoshop, great; if not, [GIMP](https://www.gimp.org/) is a free alternative.

### Installing the game
Now, you need to clone the game repository to your computer. If you are using GitHub, simply go to the [main page for this repository](https://github.com/oxguy3/ktbgame) and click the green "Clone or download" button, then click "Open in Desktop". Alternatively, you can open GitHub Desktop manually and follow the instructions they provide for cloning a repository.

Now, you will need to open the game's directory in a terminal/command prompt. If you are using GitHub Desktop, they make this easy; simply click the Repository menu and select "Open in Terminal" or "Open in Command Prompt" (the message will vary based on your OS). From the terminal/command prompt (from now on I'm just gonna say "terminal" for simplicity) that opens, you will need to run this command to install the rest of the game's dependencies: `npm install`. Note that you may need to rerun this install command in the future if the project's dependencies change.

### Setting up the Tiled map editor
We are using the Tiled map editor to design all our levels. They have documentation [over here](https://doc.mapeditor.org/en/stable/) which you can read, but you will also need more info which is specific to this game. Tiled is designed to work with a ton of games written with tons of different languages and systems. As a result, Tiled doesn't know the specifics of how our game works, so there are many features included in Tiled that will not actually do anything in our game, because I haven't added support for them.

When you open Tiled for the first time, you will first need to go to Preferences (it's under the Tiled menu on Mac or probably the File menu on Windows). Go to General, and then turn on "Embed tilesets" and "Resolve object types and properties".

## Development
Here's how you can work on the game, after you have everything installed.

**N.B.** Henceforth, when I talk about "the game's main folder", I am referring to the folder where you have the game cloned on your computer. If you are using GitHub Desktop, this will likely be in your Documents folder under `GitHub/`. The folder path will probably be something like this:

* Windows: `C:\Users\YOURNAME\Documents\GitHub\ktbgame`
* Mac: `/Users/YOURNAME/Documents/GitHub/ktbgame`

### Learning Git
Git is an extremely popular tool to manage code/assets/etc used by virtually every modern software project. It's basically like Dropbox or Google Drive or whatever, but with more structure – every time any file is changed, you have to "commit" it and give a description of your changes. The master copy of the game lives on GitHub (a popular Git provider which we're using), and everyone has their own working copy on their computer. You can freely mess with your local copy of the game, and not have to worry about breaking it for everyone else until you're ready to commit your changes.

GitHub fortunately has a lot of tools and guides to make Git a lot easier to use. I recommend first following [their Hello World guide](https://guides.github.com/activities/hello-world/) to learn the very basics of Git and how to use GitHub's website, and then do [their tutorial for GitHub Desktop](https://help.github.com/en/desktop/getting-started-with-github-desktop/creating-your-first-repository-using-github-desktop), which is an app that runs on your computer (which you'll need in order to run the game on your computer).

### Running the game server
You can run a test server for the game with these commands in your terminal (access the terminal the same way you did during the "Installing the game" section above).

* `npm run play`: Launches the test server and opens it in your web browser.
* `npm run start`: Launches the test server without opening it in your browser (useful if you already have it open and don't want a second tab).

When the game server is running, it will automatically detect when any changes have been made to the game files and refresh your browser page. If the game fails to start or freezes up, there is probably an error. You can view error messages (which typically appear as red text) in your browser's JavaScript (JS) console. You can quickly open the JS console with a keyboard shortcut; [this guide](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_are_browser_developer_tools#How_to_open_the_devtools_in_your_browser) shows how to do it on every browser and OS.

I will try my best to make to make any error messages intuitive for the types of errors that might be caused by common mistakes in level editing. However, you're seeing something that looks like gibberish, feel free to message me for help.

### Editing maps in Tiled
To open a map in Tiled, select File>Open in Tiled and then navigate to the appropriate .tmx file (do NOT open the .json versions of our maps). From the game's main folder, the maps are located in `src/assets/tilemaps/`.

Once the map is open, there are currently two layers available for you to edit, which are listed near the top left of the program: Platforms and Events.

#### The Platforms layer
The Platforms layer contains all the tiles that make up the game world. You can see all the tiles near the bottom right of the program. The behavior of each tile and how the player can interact with it is defined by the tileset, which you can learn about in the "Editing tilesets in Tiled" section below. You can learn more about editing the Platforms layer in the [Editing Tile Layers](https://doc.mapeditor.org/en/stable/manual/editing-tile-layers/) section of Tiled's manual.

#### The Events layer
The Events layer contains invisible objects that control the game's functionality (for example, the player spawn position or triggers for in-game messages). You can learn more about object layers in the [Working with Objects](https://doc.mapeditor.org/en/stable/manual/objects/) section of Tiled's manual. Currently, these types of event objects are supported:

* **PlayerSpawn**: These objects define where the player will appear when they start the level or when they die. This must be a Point object, and there must be precisely one of these in every map (no more, no less). These also should be at least one tile away from any tiles that have collision, or else the player might clip out of bounds.
* **Message**: These objects define a message to be shown to the player in a dialog box. These must be Rectangle objects, and they must have a custom string property "message" that contains the text message you wish to show the player. Currently, the message will only be visible while the player is within the trigger area (the rectangle). This system doesn't give the level designer much control yet, so it will likely be expanded in the future. Here are some possible new controls I could add to Tiled (let me know which options you want):
    * Does this message stop the player's movement until they dismiss it? (yes/no checkbox)
    * Should this message only occur once, or every time the player enters the trigger area? (yes/no checkbox)
    * What is the minimum time this message should remain visible? (number of milliseconds)
    * Are there multiple styles of dialog box we want to use (e.g. one for narrator, one for other characters, etc)?

### Editing tilesets in Tiled
A tileset is the collection of 32x32 images that make up all the tiles in a map. To open a tileset in Tiled, select File>Open in Tiled and then navigate to the appropriate .tsx file. From the game's main folder, the tilesets are located in `src/assets/tilesets/`.

Each tile's properties can be edited in the panel on the left side of the program. The Type property does not currently do anything in the game engine, but it does allow you to define a name for each tile, which is nice. Ignore the Probability property; it currently does nothing. There are also several custom properties for our game engine:

* **collides**: If enabled, this tile will function as a platform/wall. If disabled, the player will pass through this tile (it will basically become background decoration).
* **ice**: If enabled, this tile will turn on ice physics and thus be very slippery to walk on.
* **kill**: If enabled, the player will instantly die if they touch this tile.

There will likely be many more custom properties added as game development progresses.

To add new tiles, you will need to create a new 32x32 sprite and place it in the directory for your tileset within `src/assets/tilesets/`. The sprite must be a PNG and it must be named like `X,Y-name.png`, where X and Y are the coordinates where it should appear within the tilesheet, starting from 0. For example, `1,3-whatever.png` would be placed in the 2nd row, 4th column. You'll then need to run `npm run make-tilesheet`. If you are editing a tileset other than the "default" one, you'll need to specify which tileset you're generating with `npm run make-tilesheet -- -n "NAME OF TILESET"`.

Tile collision hitboxes cannot be edited with Tiled; any non-square hitboxes will have to be manually programmed in.

### Editing art assets
Except for tilesets, all images are located in the `src/assets/images/` folder. For existing images, you can edit them to your heart's content in whatever image editor you like, as long as you do not change the size or file format of the image. If there's a new image you would like to add, it will need to be programmed into the game first.

## Building
If you have a finished version of the game that you would like to deploy to web, you will first need to make a production build of the game with the command `npm run build`. This will generate a full copy of the game in the `dist/` directory of the game's main folder. You can then upload the contents of `dist/` to any web server and it should just work. This game consists entirely of static files, so you do not need to have any special software on your web server.

## Issues
Our to-do list is managed on Trello: <https://trello.com/b/GTT4ylWA/ktb-game>

Bug reports and other queries from the public may be submitted as issues here on GitHub.

## License
Copyright (c) 2019 Revolution No 9ine. All rights reserved.

At present, this software does not have a free or open source license, and is only available for personal use. This may change in the future. Feel free to open an issue if you would like to ask about reusing parts of this software.
