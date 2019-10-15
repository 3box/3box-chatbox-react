[![Discord](https://img.shields.io/discord/484729862368526356.svg?style=for-the-badge)](https://discordapp.com/invite/Z3f3Cxy)
[![npm](https://img.shields.io/npm/v/3box-chatbox-react.svg?style=for-the-badge)](https://www.npmjs.com/package/3box-chatbox-react)
[![Twitter Follow](https://img.shields.io/twitter/follow/3boxdb.svg?style=for-the-badge&label=Twitter)](https://twitter.com/3boxdb)

# 3Box Chatbox Plugin 💬

`3box-chatbox-react` node package is a drop-in react component that provides Web3 developers with a readymade chat system for their Ethereum application. Easily add rich, decentralized social discourse to your dApp with one line of code. The 3Box Chatbox plugin is built using 3Box infrastructure, and handles all logic for creating a chatbox. *Read the docs on [docs.3box.io](https://docs.3box.io/build/plugins/comments)*.

### Try the demo [here](https://3box.github.io/3box-comments-react/examples/dist/)
![Example Screenshot](comments-example-screenshot.png)
</br>

## How it Works
#### Architecture
The Chatbox plugin is built using a standard implementation of [Open Threads](https://docs.3box.io/build/web-apps/messaging/choose#open-threads) which are defined in the [3Box Threads API](https://docs.3box.io/api/messaging) and made available via the [`3Box.js SDK`](https://github.com/3box/3box-js). Chatbox messages are ephemeral and are persisted only as long as there is at least one user in the chatbox. The Chatbox plugin includes UI for inputting and displaying both an in-window and pop-up chat and all relevant logic. The component is configurable to various authentication patterns, and can handle both Web3/3Box logged-in & logged-out states. 

#### Authentication
The content of the configured chatbox cannot be read until a user has authenticated into their 3Box and joined the ephemeral (`ghost`-type) thread.  After authenticating, a user can post and receive messages from other users in *real-time*.
</br>
</br>

## Getting Started
1. Install the component
2. Choose your authentication pattern
3. Configure application settings
4. Usage

### 1. Install the component

```shell
npm i -S 3box-chatbox-react
```

### 2. Choose your authentication pattern
Depending on *when and how* your dApp handles authentication for web3 and 3Box, you will need to provide a different set of props to the component. Three acceptable authentication patterns and their respective props are discussed below in A-C:

**A) Dapp handles web3 and 3Box logins, and they run *before* component is mounted. (recommended)**

Dapp integrates with `3Box.js SDK` and the `3box-chatbox-react` component. In this case, the `box` instance returned from `Box.openBox(ethAddr)` via 3Box.js should be passed to the `box` prop in the comments component. The user's current Ethereum address should be passed to the `currentUserAddr` prop to determine which messages are their own.

**B) Dapp handles web3 and 3Box logins, but they haven't run before component is mounted. (recommended)**

Dapp integrates with `3Box.js SDK` and the `3box-comments-react` component. In this case, the login logic implemented in the dapp should be passed to the Comments component as the `loginFunction` prop, which is run when a user attempts to post a comment. The user's current Ethereum address should be passed to the `currentUserAddr` prop to determine `deletePost` access on each comment.

**C) Dapp has no web3 and 3Box login logic.**

Dapp only integrates with the `3box-comments-react` component, but not `3Box.js SDK`. All web3 and 3Box login logic will be handled within the Comments component, though it's required for the `ethereum` object from your dapp's preferred web3 provider be passed to the `ethereum` prop in the component.

#### Best practice

For the best UX, we recommend implementing one of the following authentication patterns: A; B; or B with A.

Each of these patterns allow your application to make the `box` object available in global application state where it can be used by all instances of the Chatbox component regardless of which page the user is on. This global pattern removes the need for users to authenticate on each chatbox component, should you decide to have more than one, which would be the case in C.

### 3. Configure application settings

**First, choose a name for your application's 3Box space.**

Although you are free to choose whichever name you'd like for your app's space, we recommend using the name of your app. If your application already has a 3Box space, you are welcome to use that same one for the chatbox.

**Next, choose a naming convention for your application's threads.**

The Chatbox thread needs a name, and we recommend that your application creates `threadNames` according to a simple rule. We generally like using a natural identifier, such as community name, page URL, token ID, or other similar means.

</br>
</br>


### 4. Usage

#### Example

```jsx
import ThreeBoxComments from '3box-comments-react';

const MyComponent = ({ handleLogin, box, ethereum, myAddress, currentUser3BoxProfile, adminEthAddr }) => (
    <ChatBox 
        // required
        spaceName="mySpaceName"
        threadName="myThreadName"


        // Required props for context A) & B)
        box={box}
        currentUserAddr={myAddress}

        // Required prop for context B)
        loginFunction={handleLogin}

        // Required prop for context C)
        ethereum={ethereum}

        // optional
        mute={false}
        popupChat
        showEmoji
        colorTheme="#181F21"
        currentUser3BoxProfile={currentUser3BoxProfile}
        userProfileURL={address => `https://mywebsite.com/user/${address}`}
        spaceOpts={}
        threadOpts={}
        agentProfile={
            chatName: "3Box",
            imageUrl: "https://imgur.com/RXJO8FD"
        }
    />
);
```


#### Prop Types

| Property | Type          | Default  | Required Case          | Description |
| :-------------------------------- | :-------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `spaceName`    | String        |    |  Always   | Likely your dApp name and / or comment category.  A single `spaceName` with different `threadName`s is common practice when building a dApp with multiple Comment threads. |
| `threadName`    | String       |   | Always    | A name specific to this Comments thread. |
| `adminEthAddr`    | String (Ethereum Address)       |   | Always    | The Ethereum address you wish to give admin rights to for the Comments thread.  This user will be able to delete all comments and accept members in a members-only thread. **A thread with a new admin address, despite identical `spaceName` and `threadName`, will create an entirely new thread.**|
| `box`    | Object         |   | A (and likely B)    | The `box` instance returned from running `await Box.openBox(address, web3)` somewhere in your dApp.|
| `currentUserAddr`    | String (Ethereum Address)          |    | A & B | The current user's Ethereum address. Passing this will help determine whether a user has delete access on each comment.  This prop will also let the component fetch that user's 3Box profile on component mount and render that data (profile picture) in the Comment input UI. |
| `loginFunction`    | Function       |    | B    | A function from your dApp that handles web3 and 3Box login at the global dApp state. This callback will run when a user attempts to save a comment but a `box` instance doesn't yet exist. Running this function should result in a box instance (from `const box = Box.openBox(address, web3)`) being passed as the `box` prop to this component.  |
| `ethereum`    | Object        |  window.ethereum  | C    | The `ethereum` object from whichever web3 provider your dApp uses.  The `enable` method on this object will be used to get the current user's Ethereum address and that address will be used to `openBox` within the current Component context.|
| `popupChat`    | Boolean       |  False   | Optional    | A boolean - `true` - to configure a pop up style chatbox with a button fixed to the bottom right of the window to pop open the chat UI. False will render the component in whichever container you have implemented. |
| `agentProfile`    | Object       |  { chatName: 'Chatbox', imageUrl: null }   | Optional    | An object with the name of the chatbox which will appear in the `Join thread` step and in the header of the chat UI.  The default `imageUrl` is the provided chat icon. |
| `spaceOpts`    | Object       | | Optional    | Optional parameters for threads (see [Docs.3box.io](https://Docs.3box.io) for more info)|
| `threadOpts`    | Object       | | Optional    | Optional parameters for threads (see [Docs.3box.io](https://Docs.3box.io) for more info)|
| `colorTheme`    | String       |  False  | Optional    | Pass an rgb or hex color string to match the color theme of your application |
| `mute`    | Boolean       |  False  | Optional    | Pass false to turn off sound for incoming messages. |
| `showEmoji`    | Boolean       |  False  | Optional    | Pass false to turn off the emoji pop up within the chat input UI. |
| `currentUser3BoxProfile`    | Object       |   | Optional    | If the current user has already had their 3Box data fetched at the global dApp state, pass the object returned from `Box.getProfile(profileAddress)` to avoid an extra request.  This data will be rendered in the Comment input interface.|
| `userProfileURL`    | Function       |  Defaults to returning user's 3Box profile URL  | Optional    | A function that returns a correctly formatted URL of a user's profile on the current platform.  The function will be passed an Ethereum address within the component, if needed.  A user will be redirected to the URL returned from this function when clicking on the name or Ethereum address associated with the comment in the thread.|

## License

MIT
