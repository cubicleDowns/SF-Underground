# Sounds of the San Francisco Underground
This is a project about noise levels.  Specifically the recorded noise levels on the San Francisco subway system commonly referred to as [BART](https://en.wikipedia.org/wiki/Bay_Area_Rapid_Transit).  I wanted to find a way to express these sounds visually and to turn it into a real-time mobile BART experience.  BART riders would share the experience and suffer from extreme noise levels and variation of frequency.
I divided this project up into a few main areas:

 - dB Level Recordings  ([how loud is loud](https://en.wikipedia.org/wiki/Decibel))
 - Sound Map Design
 - [Mobile Experience](https://github.com/cubicleDowns/SF-Underground/blob/master/rider/README.md) by [@seacloud9](http://twitter.com/@seacloud9)
 - App Communication
 - Deployment
 - Wifi & Delivery
 - tl;dr DEPLOY

## dB Level Recordings
I recorded hours of sound.  You can read more about the "why" at my Medium article  [here](https://medium.com/@cubicleDowns/do-you-ride-bart-i-do-daily-8778a2e6649c).  In short, I ended up with an array of sound levels measurements exactly 1 second apart.  Here is  10 seconds from an 8 min [Embarcadero to West Oakland ](https://docs.google.com/spreadsheets/d/1NoyLPjs2jCeE22xbY6eKO-jmQ7t6LeWsLKtUiRHjlVQ/edit?usp=sharing) recording.

#### Sound Level Sample
| Place | Date     | Time     | Value | Unit | 
|-------|----------|----------|-------|------| 
| 140   | 6/1/2016 | 22:22:20 | 85.6  | dB   | 
| 141   | 6/1/2016 | 22:22:21 | 88.5  | dB   | 
| 142   | 6/1/2016 | 22:22:22 | 88.6  | dB   | 
| 143   | 6/1/2016 | 22:22:23 | 95.7  | dB   | 
| 144   | 6/1/2016 | 22:22:24 | 96.9  | dB   | 
| 145   | 6/1/2016 | 22:22:25 | 100.6 | dB   | 
| 146   | 6/1/2016 | 22:22:26 | 127.6 | dB   | 
| 147   | 6/1/2016 | 22:22:27 | 129.2 | dB   | 
| 148   | 6/1/2016 | 22:22:28 | 118.5 | dB   | 
| 149   | 6/1/2016 | 22:22:29 | 96.7  | dB   | 

## Sound Map Design
[Here are a dozen or so](https://docs.google.com/spreadsheets/d/1kgTDsA4py-qznc-3fA_fCE9ToBYigWeEwpd9l7lzNFw/edit?usp=sharing) recording runs providing sound data.  I've included a garage door test as well.

You can take this data and map the magitudes to a 2D map using this [Cartesian data]().  This XY was used for the mapping as well as the dynamically generated BART line splines and may be found in the [bart.js](https://github.com/cubicleDowns/SF-Underground/blob/master/app/bart.js) file.  These splines were the path for the particle emitters as well.

| Stop                              | X   | Y   | X (Normalized) | Y (Normalized) | 
|-----------------------------------|-----|-----|----------------|----------------| 
| Pittsburg/Bay Point               | 852 | 962 | 0.852          | 0.962          | 
| North Concord/Martinez            | 796 | 928 | 0.796          | 0.928          | 
| Concord                           | 729 | 887 | 0.729          | 0.887          | 
| Pleasant Hill/Contra Costa Centre | 669 | 851 | 0.669          | 0.851          | 
| Walnut Creek                      | 602 | 810 | 0.602          | 0.81           | 
| Lafayette                         | 540 | 773 | 0.54           | 0.773          | 
| Orinda                            | 478 | 735 | 0.478          | 0.735          | 
| Rockridge                         | 416 | 697 | 0.416          | 0.697          | 
| MacArthur                         | 376 | 650 | 0.376          | 0.65           | 
| 19th St/Oakland                   | 375 | 618 | 0.375          | 0.618          | 
| 12th St/Oakland City Center       | 373 | 587 | 0.373          | 0.587          | 
| West Oakland                      | 281 | 544 | 0.281          | 0.544          | 

Plot the sound and locations to create a depth map.  There are many ways to do this, I'd suggest using [Python](http://stackoverflow.com/questions/2369492/generate-a-heatmap-in-matplotlib-using-a-scatter-data-set) or [JavaScript](https://www.patrick-wied.at/static/heatmapjs/).  Extrude the [depth map using Maya](https://knowledge.autodesk.com/support/maya/learn-explore/caas/CloudHelp/cloudhelp/2016/ENU/Maya/files/GUID-9E4B4E8F-F4B7-4005-B3F0-5441E65170CF-htm.html) to create this very depressing aural mesh: ![This view is from the sounth.  The large hump in the middle is the route under the San Francisco bay](https://cdn-images-1.medium.com/max/2000/1*zFv2hk7tDMsYvXiGYkmWbw.png)  Export the mesh as an OBJ for future import.  NOTE, I only have Maya 2013 and had to export/import repeatedly to clean up the OBJ file. glTF exporter didn't work for some reason.

[TODO:  ADD REDUCED MESH SCREEN CAPTURE HERE]

## Mobile Experience by SeaCloud9
Check out his writeup [here](https://github.com/cubicleDowns/SF-Underground/blob/master/rider/README.md).

## App Communication
Our app was composed of two major communcation requirements.   Control to Clients and Clients to Clients.   That second realtion ship is the scariest to consider

##### Control to Client
 - recorded dB levels every second
 - avg-freq @ 60 (fps)
 - manual interrupts (e.g. BART arrives at a start or visualization activates)

##### Client to Client
 - position  at 60 (fps)
 - rotation  @ 60 (fps)
 - NOTE: control is a client as well

### Deployment
[Surge is great!](http://surge.sh/) && FREE!  It deployes to the AWS CDN.
 - `npm install -g surge`
 - `surge app` .... [deployed domain]
 - `surge rider/www` ... [mobile deployed domain]
 - `surge help` to learn more

 If you want to deploy via CircleCI, you can follow their [instructions to add a Surge Token and Login](https://surge.sh/help/integrating-with-circleci).  I've included a [circle.yml](https://github.com/cubicleDowns/SF-Underground/blob/master/circle.yml) file for you already.
 
### Wifi & Delivery
More-so than most applications, this one works best in low-latency/high-bandwidth delivery. We crossed our fingers, you may have to as well. Ideally, have your users download any large files before the presentation.

### tl;dr DEPLOY
To use the code.  You'll need to:

1. Create a free firebase account
2. copy() the *FB URL.io* after setup
3. Paste into two places
    * [BART Control endpoint](https://github.com/cubicleDowns/SF-Underground/blob/master/app/js/ks.js).
    * [BART Mobile location](https://github.com/cubicleDowns/SF-Underground/blob/master/rider/app/app.js).
4. Somehow launch `app` && `rider/www` locally or on a server.
5. Connect to the `app` location and click the play button in the bottom left.  This initiates communcation to the `rider/www` client.

