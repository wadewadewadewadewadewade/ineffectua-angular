
# ineffectua

My wife is living in a broken body. But you cannot see the breaks by looking at her outside. On the outside she looks fine. But inside there is an invisible illness that is breaking her apart in little pieces. I love my wife very much, and in helping her prepare for her many doctor visits there are so many details, so many notes and bits of data it is useful to track: both for her and for her doctors.

And she is not alone. There are thousands of others around the world that also have invisible illnesses. Lupus, fibromyalgia, and many varieties of auto-immune diseases abound, just to name a few classes of invisible illness.

## Firebase

Ineffectua uses firebase for pretty much everything: functions, hosting, realtime database. Getting it set up with SSR took some experimenting. I found these article helpful:
* https://medium.com/angular-in-depth/angular-5-universal-firebase-4c85a7d00862
* https://fireship.io/lessons/angular-universal-firebase/

### Deploy

running `firebase deploy` requires node 10, and will lint, build:ssr, and then deploy dist/app-server (looking at main.js) to ineffectua.web.app. Make sure to use firebase-functions 3.5.0 or greater (https://github.com/firebase/firebase-functions/issues/437)