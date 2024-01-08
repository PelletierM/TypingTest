# TPWRTR (Typing Test)
### Video Demo: https://youtu.be/Q87sCpCO8cM
This is a typing test app that I made for fun and that tries to improve on other typing tests while providing a good user experience. The app's design and features are inspired by monkeytype.com, a famous typing test app. The app is not deployed online at the moment, but it is showcased in the short video linked above.


## Features
#### Different modes
The app features two different modes that let you type either with a time or a word limit. Each mode has different available lengths.

#### Weighted random word generation
The current wordlist, which is in French, was made by parsing / filtering different French books and by keeping track each word's occurrence. That process created a list of words thar are ordered and weighted by frequency. The app can then generate tests that are much closer to reality than other apps that randomly select from a non weighted list of words. 

#### Account system
The app features an account system that allows users to save their results in the database. Any user can see the leaderboards (top 10) for some of the modes, while registered users can also access their profile page to view some statistics taken from previous tests.

#### Upcoming

 - Color themes
 - Saving preferences for registered users
 - Email verification

## Technology stack
The app was built using the following technologies :

 - Frontend: HTML, CSS (SCSS), JavaScript (TypeScript)
 - Backend: Python (Flask), MySQL
