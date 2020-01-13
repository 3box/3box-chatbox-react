import React, {
  Component
} from 'react';
import Box from '3box';
import PropTypes from 'prop-types';
import resolve from 'did-resolver';
import registerResolver from '3id-resolver';

import { sortChronologicallyAndGroup } from './utils';

import Launcher from './components/Launcher';
import ChatWindow from './components/ChatWindow';
import './index.scss';

class ChatBox extends Component {
  constructor(props) {
    super(props);
    const {
      agentProfile,
      showEmoji,
      currentUserAddr,
      box,
      ethereum,
      colorTheme,
      popupChat,
      mute,
      openOnMount,
    } = this.props;

    this.state = {
      agentProfile: agentProfile || {
        chatName: 'Chatbox',
        imageUrl: null
      },
      colorTheme: colorTheme || '#181F21',
      showEmoji,
      popupChat,
      isOpen: openOnMount || false,
      newMessagesCount: 0,
      updateCommentsCount: 0,
      membersOnlineLength: 1,
      mute,
      threadJoined: !!ethereum,
      dialogue: [],
      uniqueUsers: [],
      membersOnline: [],
      thread: {},
      profiles: {},
      currentUser3BoxProfile: {},
      box,
      currentUserAddr,
      isJoiningThread: false,
      ethereum: ethereum || window.ethereum,
    }
  }

  async componentDidMount() {
    const { currentUser3BoxProfile } = this.props;

    // get ipfs instance for did-resolver
    const IPFS = await Box.getIPFS();
    registerResolver(IPFS);

    if ((!currentUser3BoxProfile || !Object.entries(currentUser3BoxProfile).length)) {
      await this.fetchMe();
    }

    this.fetchThread();
  }

  // componentDidUpdate(prevProps) {
  //   const {
  //     box
  //   } = this.props;

  //   // if box is updated in parent, update component state
  //   const prevBoxEmpty = !prevProps.box || !Object.entries(prevProps.box).length;
  //   if (prevBoxEmpty && box && Object.entries(box).length > 0) {
  //     this.setState({ box });
  //   }
  // }

  // get thread from public api only on component mount
  fetchThread = async () => {
    const { ethereum } = this.state;
    const {
      spaceName,
      threadName,
    } = this.props;

    if (!spaceName || !threadName) console.error('You must pass both spaceName and threadName props');

    let box;
    let thread;
    let dialogue;
    if (ethereum) {
      box = await Box.create({ethereum});
      thread = await box.openThread(spaceName, threadName, { ghost: true });
      dialogue = await thread.getPosts()
    }

    this.setState({ thread, threadJoined: !!ethereum, box, dialogue }, async () => {
      await this.updateComments();
      await this.updateMembersOnline();

      thread.onUpdate(() => this.updateComments());
      thread.onNewCapabilities(() => this.updateMembersOnline());
    });

  }

  openThread = async () => {
    const { box, ethereum } = this.state;
    const { loginFunction } = this.props;

    const noWeb3 = (!ethereum || !Object.entries(ethereum).length) && !loginFunction;
    if (noWeb3) return;
    // add error message

    // this.setState({ threadLoading: true });

    if (!box || !Object.keys(box).length) loginFunction ? await loginFunction() : await this.openBox();
    await this.joinThread();

    this.setState({ threadLoading: false });
  }

  openBox = async () => {
    const {
      ethereum,
      box,
      currentUserAddr,
    } = this.state;
    const { spaceName } = this.props;

    if (!ethereum) console.error('You must provide an ethereum object to the comments component.');

    await box.auth([spaceName], { address: this.props.currentUserAddr || currentUserAddr });
    this.setState({ hasAuthed: true });

    await box.syncDone;
  }

  // joinThread = async () => {
  //   const {
  //     spaceName,
  //     threadName,
  //     spaceOpts,
  //   } = this.props;
  //   this.setState({ isJoiningThread: true });
  //   const stateBox = (this.state.box && Object.keys(this.state.box).length) && this.state.box;
  //   const propBox = (this.props.box && Object.keys(this.props.box).length) && this.props.box;
  //   const box = stateBox || propBox;
  //   const space = await box.openSpace(spaceName, spaceOpts || {});
  //   const opts = {
  //     ghost: true
  //   };
  //   const thread = await space.joinThread(threadName, opts);

  //   this.setState({ thread, threadJoined: true, }, async () => {
  //     await this.updateComments();
  //     await this.updateMembersOnline();

  //     thread.onUpdate(() => this.updateComments());
  //     thread.onNewCapabilities(() => this.updateMembersOnline());
  //   });
  // }

  fetchMe = async () => {
    const { profiles, ethereum } = this.state;
    const { currentUserAddr, userProfileURL } = this.props;

    let myAddress;

    if (currentUserAddr) {
      myAddress = currentUserAddr;
    } else {
      const addresses = await ethereum.enable();
      myAddress = addresses[0];
    }

    const currentUser3BoxProfile = await Box.getProfile(myAddress);
    currentUser3BoxProfile.profileURL = userProfileURL ? userProfileURL(myAddress) : `https://3box.io/${myAddress}`;
    currentUser3BoxProfile.ethAddr = myAddress;

    profiles[myAddress] = currentUser3BoxProfile;

    this.setState({ currentUser3BoxProfile, profiles, currentUserAddr: myAddress });
  }

  // get profiles of commenters from public api only on component mount
  fetchProfiles = async (uniqueUsers) => {
    const { profiles, currentUser3BoxProfile, currentUserAddr } = this.state;

    const profilesToUpdate = uniqueUsers.filter((did, i) => !profiles[uniqueUsers[i]]);

    if (!profilesToUpdate.length) return;

    const fetchProfile = async (did) => await Box.getProfile(did);
    const fetchAllProfiles = async () => await Promise.all(profilesToUpdate.map(did => fetchProfile(did)));
    const profilesArray = await fetchAllProfiles();

    const getEthAddr = async (did) => await resolve(did);
    const getAllEthAddr = async () => await Promise.all(profilesToUpdate.map(did => getEthAddr(did)));
    const ethAddrArray = await getAllEthAddr();

    profilesArray.forEach((profile, i) => {
      const { userProfileURL } = this.props;
      const ethAddr = ethAddrArray[i].publicKey[2].ethereumAddress;
      profile.ethAddr = ethAddr;
      profile.profileURL = userProfileURL ? userProfileURL(ethAddr) : `https://3box.io/${ethAddr}`;
      profiles[profilesToUpdate[i]] = profile;
    });

    if (currentUserAddr) profiles[currentUserAddr] = currentUser3BoxProfile;

    this.setState({
      profiles,
    });
  }

  updateComments = async () => {
    const {
      thread,
      uniqueUsers,
      newMessagesCount,
      dialogueLength,
      updateCommentsCount,
    } = this.state;

    const updatedUnsortedDialogue = await thread.getPosts();
    const newDialogueLength = updatedUnsortedDialogue.length;
    const updatedDialogue = sortChronologicallyAndGroup(updatedUnsortedDialogue);

    // if there are new messagers, fetch their profiles
    const updatedUniqueUsers = [...new Set(updatedUnsortedDialogue.map(x => x.author))];

    // count new messages for when popup closed
    const numNewMessages = newDialogueLength - dialogueLength;
    let totalNewMessages = newMessagesCount;
    totalNewMessages += numNewMessages;
    if (uniqueUsers.length === updatedUniqueUsers.length) {
      this.setState({
        dialogue: updatedDialogue,
        newMessagesCount: totalNewMessages || 0,
        dialogueLength: newDialogueLength,
      });
    } else {
      await this.fetchProfiles(updatedUniqueUsers);
      this.setState({
        dialogue: updatedDialogue,
        newMessagesCount: totalNewMessages || 0,
        dialogueLength: newDialogueLength,
        uniqueUsers: updatedUniqueUsers
      });
    }

    if (updateCommentsCount === 0) this.setState({ isJoiningThread: false });
    this.setState({ updateCommentsCount: updateCommentsCount + 1 });
  }

  updateMembersOnline = async () => {
    const { thread, currentUserAddr } = this.state;

    const updatedMembersOnline = await thread.listMembers();

    await this.fetchProfiles(updatedMembersOnline);
    if (currentUserAddr) updatedMembersOnline.push(currentUserAddr);

    this.setState({
      membersOnline: updatedMembersOnline,
      membersOnlineLength: updatedMembersOnline.length,
    });
  }

  handleClick = () => {
    this.setState({
      isOpen: !this.state.isOpen,
      newMessagesCount: 0
    });
  }

  postMessage = async (message) => {
    const { hasAuthed } = this.state;
    try {
      if (!hasAuthed) await this.openBox();
      await this.state.thread.post(message.data.text || message.data.emoji);
      await this.updateComments();
    } catch (error) {
      console.error('There was an error saving your message', error);
    }
  }

  render() {
    const {
      dialogue,
      currentUserAddr,
      profiles,
      currentUser3BoxProfile,
      threadLoading,
      agentProfile,
      threadJoined,
      colorTheme,
      showEmoji,
      popupChat,
      newMessagesCount,
      mute,
      membersOnlineLength,
      ethereum,
      box,
      isJoiningThread,
      membersOnline,
    } = this.state;
    const { loginFunction, userProfileURL } = this.props;

    const noWeb3 = !box && !loginFunction && !ethereum;
    const isOpen = this.props.hasOwnProperty('isOpen') ? this.props.isOpen : this.state.isOpen;

    if (popupChat) {
      return (
        <Launcher
          postMessage={this.postMessage}
          handleClick={this.handleClick}
          openThread={this.openThread}
          resetNewMessageCounter={this.resetNewMessageCounter}
          agentProfile={agentProfile}
          loginFunction={loginFunction}
          messageList={dialogue}
          showEmoji={showEmoji}
          currentUserAddr={currentUserAddr}
          currentUser3BoxProfile={currentUser3BoxProfile}
          profiles={profiles}
          threadLoading={threadLoading}
          threadJoined={threadJoined}
          colorTheme={colorTheme}
          isOpen={isOpen}
          newMessagesCount={newMessagesCount}
          mute={mute}
          membersOnlineLength={membersOnlineLength}
          membersOnline={membersOnline}
          ethereum={ethereum}
          noWeb3={noWeb3}
          isJoiningThread={isJoiningThread}
          box={box}
          userProfileURL={userProfileURL}
        />
      );
    }

    return (
      <ChatWindow
        postMessage={this.postMessage}
        openThread={this.openThread}
        messageList={dialogue}
        agentProfile={agentProfile}
        loginFunction={loginFunction}
        isOpen={isOpen}
        showEmoji={showEmoji}
        profiles={profiles}
        currentUser3BoxProfile={currentUser3BoxProfile}
        currentUserAddr={currentUserAddr}
        threadJoined={threadJoined}
        threadLoading={threadLoading}
        colorTheme={colorTheme}
        mute={mute}
        membersOnlineLength={membersOnlineLength}
        membersOnline={membersOnline}
        ethereum={ethereum}
        noWeb3={noWeb3}
        userProfileURL={userProfileURL}
        isJoiningThread={isJoiningThread}
        box={box}
        notPopup
      />
    )
  }
}

ChatBox.propTypes = {
  chatName: PropTypes.string,
  colorTheme: PropTypes.string,
  popupChat: PropTypes.bool,
  mute: PropTypes.bool,
  currentUserAddr: PropTypes.string,
  userProfileURL: PropTypes.func,
  loginFunction: PropTypes.func,
  box: PropTypes.object,
  spaceOpts: PropTypes.object,
  agentProfile: PropTypes.object,
  ethereum: PropTypes.object,
  threadOpts: PropTypes.object,
  currentUser3BoxProfile: PropTypes.object,
  spaceName: PropTypes.string.isRequired,
  threadName: PropTypes.string.isRequired,
  showEmoji: PropTypes.bool,
  openOnMount: PropTypes.bool,
  isOpen: PropTypes.bool,
};

ChatBox.defaultProps = {
  chatName: '',
  currentUserAddr: '',
  agentProfile: null,
  userProfileURL: null,
  box: null,
  ethereum: null,
  currentUser3BoxProfile: null,
  threadOpts: null,
  spaceOpts: null,
  loginFunction: null,
  showEmoji: true,
  openOnMount: true,
};

export default ChatBox;