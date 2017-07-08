# [RainbowSpace](http://RainbowSpace.xyz/)

A tool for inspecting the color gamut of images in 3D.

![3d color space visualisation](https://68.media.tumblr.com/8807fbf55d3f69e97945093d691cc87e/tumblr_ohhkonN4Dq1relaado2_400.gif)
![dragging user images into the viewport](https://68.media.tumblr.com/fb3ea261f867107812d89b8e0fd0c341/tumblr_ohhkonN4Dq1relaado1_400.gif)
![exploring different spacial mappings](https://68.media.tumblr.com/2994df8a5935eacf324769f0db1847dd/tumblr_ohhkonN4Dq1relaado3_r1_400.gif)
![using camera input from a smartphone](https://68.media.tumblr.com/d27e99a5634f8e9da63a7bd74a8f9e4a/tumblr_ohhkonN4Dq1relaado4_400.gif)

###Features:
* Drag an image from your computer or another web browser window into the 3D viewport
* Use the "Upload Image" button and select existing image, or take a picture with your phone/tablet camera
	* Be patient with your phone/tablet if you use this feature - it may take a while until I have time to optimise it
	* I auto-shrink uploaded images to 256x256 max on mobile devices to try and help with this
* Portrait mode on most phones allows you to see settings and the visualization at the same time
* Leaving this browser tab open too long on a mobile might have drastic effects on battery life - optimization to come
	* Yes I'm listing this as a feature because I can
* Scroll your mouse wheel to zoom in and out, if you have one
	* Scroll left/right or hold shift while scrolling to scroll 10x more precisely
	* Good luck with the weird left/right scrolling on trackpads
* Use your Numpad* keys for quick access to camera views; Blender defaults.
	* Numpad 5: Toggle orthographic / perspective camera mode
	* Numpad 7: Top
	* Numpad 1: Front
	* Numpad 3: Right
	* Numpad 0: "White corner", 3/4ths view
	* ctrl + Numpad 7: Bottom
	* ctrl + Numpad 1: Back
	* ctrl + Numpad 3: Left
	* ctrl + Numpad 0: "Black corner", -3/4ths view
* I reserve the right to force-push on this repo when I see fit because I'm the only developer
	* yes this is a feature too so I can fix things if it went bad

###Supported systems:
These are the setups I have access to, so these are what I can ensure work properly.
* Desktop
	* FireFox, Chrome, or Safari on a machine capable of running WebGL
		* Some laptops suck and can't WebGL (11" Macbook Air)
* Mobile
	* Chrome on Android on a device capable of running WebGL
	* Safari on iOS 10.0 or newer, probably

### ToDo
* Expand/collapse settings sections
* Pan around the scene
* Zoom on Mobile devices
* Live stream from webcam / phone camera
* Tweening states
* Grid toggle
* Show multiple images
* Display a loading progress indicator
* Display image specs and option to limit size
* Any kind of persistence
* Ability to share a particular image/configuration via link
* Some kind of error displays when things break
* Figure out what to do with the settings toggle margin issue on windows desktop


 *I will never stop being angry at Apple for removing access to at least default Numpad emulation on their laptops. Everyone should have access to this basic computing input concept. Also, I particularly hate entering keyboard input through touch screens.
