# NEEO SDK based driver for DreamScreen

You can find more about DreamScreen at https://www.dreamscreentv.com/.

To find out more about NEEO, the Brain and "The Thinking Remote" checkout https://neeo.com/.

## Prerequisite

* You must have Node.js v6 installed, see http://nodejs.org

## Getting started

* download the driver and unzip it (extract files).

* For windows: Go to start -> Run, Type cmd and press ok.
  with the command promt go to the extracted driver. i.e. `cd Downloads` then `cd neeo_driver-DreamScreen-master` depending on the location.
  insode the folder run `npm install` to install needed dependencies.

* For mac/linux open the console.
  move to the location where the files are extracted. and run `npm install` to install needed dependencies.

* Start up the driver by executing `node index.js`

### Driver

__How to add a DreamScreen to NEEO:__
2. Connect to your NEEO Brain in the NEEO app
3. Go to add device
4. You should be able to find and add the DreamScreen by searching for _DreamScreen_
5. When you selected the DreamScreen driver you will be presented with all the DreamScreens found in your network, Select the one you want to add.

__How to use a DreamScreen with NEEO:__
The DreamScreen is marked as a LIGHT device type. this way you can use a power On/Off switch and Brightness slider like any other light device in NEEO.

__Adding shortcuts:__
While in any recipe, you can add shortcuts (Add buttons to the GUI).
You can add the following buttons:
- Mode Off
- Mode Video
- Mode Music
- Mode Ambient
- Input HDMI 1
- Input HDMI 2
- Input HDMI 3

__automate input selection and or Mode selection:__
1. Edit a recipe.
2. add a command.
3. sellect the DreamScreen.
4. Sellect the command you want to automate.


# Versions


### 0.0.6
- seperated each driver service (HD, 4K and Sidekick).
- Fixed notification issues.
- Initialize driver only when needed.
- Added Ambient modes.

### 0.0.5
- Code Cleanup

### 0.0.4
- Modules Cleanup

### 0.0.3
- Fixed HDMI input change.

### 0.0.2
- First almost working driver

### 0.0.1
- POC


# SPECIAL THANKS
- DreamScreen for supporting this project!
- Kyle Seconrd for writing the node mudule needed for this project. (https://github.com/ksecord/dreamscreen-node)
- Michael Vogt for helping me out and giving new insights.