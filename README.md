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

#### Display the table view

```-t``` or ```--table``` (defaults to on)

Display the current week in table form. The bottom row will include all weeks specified with ```-w```

```*``` on a row indicates that a timer for that field is running

#### Display the simple view

```-s``` or ```--simple``` (defaults to off)

Display the time left in the day
