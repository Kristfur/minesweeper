To ensure functionality on a variety of browsers, all tests were performed on the following:

- Google Chrome
- Microsoft Edge
- Firefox
- Opera

As well as on the following devices:

- Samsung Galaxy A21s (DuckDuckGo)
- iPhone 8 (Safari)

Any comments will be found beside the test results.

# Categories
* [Responsiveness](#responsiveness)
* [Links](#links)
    * [404 PAge](#404-page)
* [Menu Functionality](#menu-functionality)
     * [Home Page](#home-page)
     * [Game Page](#game-page)
     * [Rules Modal](#rules-modal)
     * [Settings Modal](#settings-modal)
     * [Leaderboard](#leaderboard)
     * [Lose Page](#lose-page)
     * [WinPage](#win-page)
* [Gameplay](#gameplay)
* [Keyboard Controls](#keyboard-controls)
* [Sounds](#sounds)

## Responsiveness
|Description|Step|Step Description|Expected Result|Actual Result|Pass\Fail
|-|-|-|-|-|-
|All website pages were tested for responsiveness on screen sizes of 320px and above|1|Open browser and go to the link [https://kristfur.github.io/minesweeper/](https://kristfur.github.io/minesweeper/)
| |2|Open developer tools by pressing CTRL+SHIFT+I
| |3|Toggle device toolbar and set width to 320px|Website has all elements on screen and are not overlapping. Images are not pixelated or stretched|As expected|Pass
| |4|Drag window to maximum width|Website has all elements on screen and are not overlapping. Images are not pixelated or stretched|As expected|Pass

## Links

All links were tested to ensure they lead to the correct destination:
- Logo -> index.html
- GitHub link in footer -> https://github.com/Kristfur

### 404 Page
- Link leads back to index.html
- After 10 seconds, the page automatically redirects to index.html, as expected.

## Menu Functionality
### Home Page

All buttons were checked to ensure they opened the correct page:
- PLAY -> Goes to game page
- Rules -> Opens rules modal
- Settings -> Opens settings modal
- Leaderboard -> Goes to leaderboard page

### Game Page
Reset button was checked to ensure it correctly reset game:
|Expected behaviour | Actual behaviour | Pass/Fail
|-|-|-
|Mines left counter returns to 0|Counter displays 0|Pass
|Timer is reset to 00:00|Timer displays 00:00|Pass
|Game board tiles get hidden|All tiles are hidden| Pass

Remaining buttons were checked to ensure they opened the correct page:
- Rules -> Opens rules modal (does not affect current game)
- Home -> Goes to home page
- Leaderboard -> Goes to leaderboard page

### Rules Modal
- Modal opens and closes as expected. 
- All text is visible. 
- X icon is highlighted when hovered over, and it successfully closes modal when clicked.

### Settings Modal
- Modal opens and closes as expected. 
- All text and elements are visible. 
- X icon is highlighted when hovered over, and it successfully closes modal when clicked.
- Sound checkbox is behaving as expected. Sound is on/off corresponding with the checkbox.
- Grid size selection box was tested as follows:

|Steps|Expected behaviour | Actual behaviour | Pass/Fail
|-|-|-|-
|Select grid size 3x3. Close the modal and click play. Observe the game board. | Game grid is 3 by 3 tiles| As expected| Pass
|Select grid size 5x5. Close the modal and click play. Observe the game board. | Game grid is 5 by 5 tiles| As expected| Pass
|Select grid size 8x8. Close the modal and click play. Observe the game board. | Game grid is 8 by 8 tiles| As expected| Pass
|Select grid size 10x10. Close the modal and click play. Observe the game board. | Game grid is 10 by 10 tiles| As expected| Pass

- Mines selection box was tested as follows:

|Steps|Expected behaviour | Actual behaviour | Pass/Fail
|-|-|-|-
|Select mines - few. Close the modal and click play. Click to reveal any tile. Observe the game board. Repeat for all grid sizes | Mines left number is smallest with {few} setting, in the middle with {normal} settings and the largest with {many} setting| As expected: 3x3(few=1, normal=2, many=3) 5x5(few=3, normal=6, many=8) 8x8(few=9, normal=16, many=22) 10x10(few=15, normal=25, many=35)| Pass

### Leaderboard
All elements behaved as expected:
- Back button returns to the home page.
- Grid size and mines selectors behave as intended.
- Leaderboard handles scores correctly:

|Steps|Expected behaviour | Actual behaviour | Pass/Fail
|-|-|-|-
|Win a game with a top-5 time and save the score|New score is highlighted and displayed in the appropriate rank|As expected|Pass
|Win a game with a time not in the top-5 and save the score|New score is highlighted and displayed below the top-5 times without a ranking|As expected | Pass

The user's scores are stored locally to the device, so they can access them later. The storing of scores was tested as follows:

|Steps|Expected behaviour | Actual behaviour | Pass/Fail
|-|-|-|-
|Win a game and save the score, then close the website and the browser. Reopen the browser and go to the website. Navigate to the leaderboard and select the settings the score was set with. | The users score(s) that they set previously are present | As expected | Pass

### Lose Page
Both buttons behaved as expected:
- Try again button closes page and correctly resets game.
- Home button leads to the home page.

### Win Page
Everything behaves as expected:
- No Thanks button warns user that their score will not be saved and gives them one last change to go back before taking the user to the home page.
- Click logo to go to home page, acts the same as the 'No Thanks' button above.
- Save button and input field was tested as follows:

|Steps|Expected behaviour | Actual behaviour | Pass/Fail
|-|-|-|-
|Leave name field blank, then click save|Does not save, tells user that input cannot be blank|As expected|Pass
|Enter "a b c" into name field, then click save|Does not save, tells user the name cannot contain spaces|As expected|Pass
|Enter "12345678987654321" into name field, then click save|Does not save, tells user the name cannot contain more than 12 characters|As expected|Pass
|Enter "Kristfur" into name field, then click save|Does save, redirects user to the leaderboard page|As expected|Pass

## Gameplay
All gameplay elements behave as intended, the testing procedures are described below.

Reveal and flag tiles:

|Steps|Expected behaviour | Actual behaviour | Pass/Fail
|-|-|-|-
|Click play to start game, then click any tile to reveal it|Tile reveals either a number (1 to 8) or a blank space|As expected|Pass
|then click and hold any hidden tile to place a flag on it|a flag is placed on the tile|As expected|Pass
|then click the flagged tile|Tile is not revealed, as flag prevents that action|As expected|Pass
|then click and hold the flagged tile|Flag is removed |As expected|Pass
|then click the previously flagged tile|Tile is revealed (same as first test) |As expected|Pass

First tile revealed is never a mine:

|Steps|Expected behaviour | Actual behaviour | Pass/Fail
|-|-|-|-
|Click play to start game, then click on any tile to reveal it| The tile is not a mine| As expected|Pass
|Return to home menu and repeat previous step multiple times| The first tile revealed every time is not a mine| As expected |Pass

Revealing a 0 reveals all adjacent tiles:

|Steps|Expected behaviour | Actual behaviour | Pass/Fail
|-|-|-|-
|Click play to start game, then click on any tile to reveal it
|Return home and repeat previous step until a blank tile is revealed| When a blank tile is revealed, all it's neighbouring tiles are also revealed| As expected|Pass

Lose game

|Steps|Expected behaviour | Actual behaviour | Pass/Fail
|-|-|-|-
|Play game until you reveal a mine| You lose page pops up| As expected |Pass

Win game

|Steps|Expected behaviour | Actual behaviour | Pass/Fail
|-|-|-|-
|Play game until you flag all tiles that are mines| You win page pops up| As expected |Pass
|Play game until you reveal all tiles that are not mines| You win page pops up| As expected |Pass

## Keyboard Controls
Keyboard controls testing procedure:

|Steps|Expected behaviour | Actual behaviour | Pass/Fail
|-|-|-|-
|Start game, press 'w' key|Highlighted border should appear on the top leftmost tile|As expected|Pass
|then press 's'|Border box should move down one tile|As exppected|Pass
|then press 'd'|Border box should move right one tile|As exppected|Pass
|then press 'a'|Border box should move left one tile|As exppected|Pass
|then press 'w'|Border box should move up one tile|As exppected|Pass
|then press 'w'|Border box should not move as it is against edge|As exppected|Pass
|then press 'e'|A flag should be placed on the current tile|As exppected|Pass
|then press 'q'|The tile cannot be revealed because it has a flag |As exppected|Pass
|then press 'e'|The flag should be removed from the tile|As exppected|Pass
|then press 'q'|The tile should be revealed|As exppected|Pass

These tests were repeated with CAPS LOCK on, results were as expected. 

## Sounds
All sounds for the game work as intended. The correct sound plays for each action, and the sound plays at the correct time.

No sounds play when the sound option is turned off (default), as intended.

The following actions each have a unique sound that plays as intended:
- Menu click
- Reveal tile
- Place/remove flag
- Reveal mine/lose
- Win