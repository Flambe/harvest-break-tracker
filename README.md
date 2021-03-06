# harvest-break-tracker

To install:

1. Ensure that you have NodeJS installed (https://github.com/creationix/nvm)

2. Run: ```npm i -g @steveaxtmann/harvest-break-tracker```

Then you can run it with:

```hbt```

### Options

#### Weeks to process

```-w n``` or ```--weeks n``` (n is an integer, defaults to 0)

Include the n amount of previous weeks when processing time left

#### Refresh automatically

```-r``` or ```--refresh``` (defaults to off)

Auto update the time every minute

#### Change the display mode

```-d simple|table``` or ```--display simple|table``` (defaults to what you selected when setting up)

Display the current week in ```table``` or ```simple``` form.

If ```table``` mode:

* The bottom row will include all weeks specified with ```-w```
* ```*``` on a row indicates that a timer for that field is running

#### Show remaining time in the system tray

```-t``` or ```--tray``` shows the remaining time in the system tray. The cmd process will then auto update, like with ```-r```

* A ```*``` prefix indicates that a work timer is running
* A ```B``` prefix indicates that a break timer is running
