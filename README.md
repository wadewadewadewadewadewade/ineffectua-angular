
# ineffectua

My wife is living in a broken body. But you cannot see the breaks by looking at her outside. On the outside she looks fine. But inside there is an invisible illness that is breaking her apart in little pieces. I love my wife very much, and in helping her prepare for her many doctor visits there are so many details, so many notes and bits of data it is useful to track: both for her and for her doctors.

And she is not alone. There are thousands of others around the world that also have invisible illnesses. Lupus, fibromyalgia, and many varieties of auto-immune diseases abound, just to name a few classes of invisible illness.

## Status

Fails

* `firebase serve` works but not `firebase deploy` because "ssr expects function, got object"
* `ng test --coverage` fails for one reason I am still trying to solve:
** NullInjectorError: No provider for InjectionToken angularfire2.app.options

https://medium.com/@gregor.woiwode/how-to-setup-jest-in-an-ionic-4-project-ff1e5b72dd79

## Firebase

Ineffectua uses firebase for pretty much everything: functions, hosting, realtime database. Getting it set up with SSR took some experimenting. I found these article helpful:
* https://medium.com/angular-in-depth/angular-5-universal-firebase-4c85a7d00862
* https://fireship.io/lessons/angular-universal-firebase/

### Deploy

running `firebase deploy` requires node 10, and will lint, build:ssr, and then deploy dist/app-server (looking at main.js) to ineffectua.web.app. Make sure to use firebase-functions 3.5.0 or greater (https://github.com/firebase/firebase-functions/issues/437)

I removed /functions/ and added some lines to package.json that firebase deploy required, and used functions.https starting with (https://medium.com/angular-in-depth/angular-5-universal-firebase-4c85a7d00862) and modifying a lot. I also had to add moduleFilename.includes('firebase-tools') to server.ts to hook ssr=app() into funtions when being hosted from firebase functions.

## TODO

* After the above issues get solved, I'll add forgot-password functionality using this tutorial: https://medium.com/@c_innovative/implementing-password-reset-can-be-a-tricky-but-inevitable-task-737badfb7bab
* Also, I'd like to add multiple calendar functionality to chart dates for different symptoms or just for notes like 'changed meds on xx/yy/zzzz'