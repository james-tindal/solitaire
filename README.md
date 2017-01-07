# solitaire

Klondike Solitaire web app. Available at http://solitaire.surge.sh/

Cmd-z to undo a move.
Double-click to move a card to the foundations.

```
npm i             # install dependencies 
npm start 3000    # build for development, watch for changes, run on port 3000
webpack -p        # build for production
```

It works in a similar way to Elm or React-Redux. Yo-Yo DOM diffing, Flyd streams, excessive Ramda function pipelines, tcomb runtime type-checking, Webpack module bundling, monad control flow. The Move action is mess - I was experimenting and would not do it the same way again.

## index.js

### update :: Model, Action -> Object
An Action contains a function an arguments object. `update` returns the result of calling the function; passing the model if the action was called without arguments, otherwise {model, arguments}.


## actions.js

### Message :: {name: Reducer...} -> {name: Action...}


## drag.js

This module exports a function to the card component. On a card's mousedown event, the mousedrag stream collects mousedrag events until mouseup. These values are mapped to objects {position, migrant, action$}. `migrant` is the card which is moving.

### flyd.on(..., mousedrag)
Move card to follow cursor with css transform.

### flyd.on(..., mouseup)
Reset style on dragged card. Add Move action to action$, passing an object with the path of the original location and the path of the card it is dropping on.
