import React, {
  Component
} from 'react';
import Box from '3box';
import PropTypes from 'prop-types';
import resolve from 'did-resolver';
import registerResolver from '3id-resolver';


import { checkIsMobileDevice } from './utils';

import Launcher from './components/Launcher';
import ChatWindow from './components/ChatWindow';
import './index.scss';

class ChatBox extends Component {
  constructor(props) {
    super(props);
    const {
      agentProfile,
      colorTheme,
      showEmoji,
      currentUserAddr,
      box,
      ethereum,
      popupChat,
    } = this.props;

    this.state = {
      agentProfile: agentProfile || {
        teamName: 'Ghost',
        imageUrl: null
      },
      colorTheme: colorTheme || '#181F21',
      showEmoji,
      popupChat,
      isOpen: false,

      dialogueLength: null,
      isLoading: false,
      threadJoined: false,
      dialogue: [],
      uniqueUsers: [],
      thread: {},
      profiles: {},
      currentUser3BoxProfile: {},
      box,
      currentUserAddr,
      ethereum: ethereum || window.ethereum,
      isMobile: checkIsMobileDevice(),
    }
  }

  async componentDidMount() {
    const { currentUserAddr } = this.state;
    const { currentUser3BoxProfile } = this.props;
    this.setState({ isLoading: true });

    // get ipfs instance for did-resolver
    const IPFS = await Box.getIPFS();
    registerResolver(IPFS);

    // if we have eth and don't have 3box profile, fetch it
    if (currentUserAddr &&
      (!currentUser3BoxProfile || !Object.entries(currentUser3BoxProfile).length)) {
      this.fetchMe();
    }

    this.setState({ isLoading: false });
  }

  componentDidUpdate(prevProps) {
    const {
      currentUserAddr,
      currentUser3BoxProfile,
      box
    } = this.props;

    // if current user's eth addr is updated in parent, fetch profile
    if (currentUserAddr !== prevProps.currentUserAddr) {
      const hasNoUserProfile = (!currentUser3BoxProfile || !Object.entries(currentUser3BoxProfile).length);
      this.setState({ currentUserAddr }, () => { hasNoUserProfile && this.fetchMe(); });
    }

    // if current user's profile is updated in parent, update UI
    if (currentUser3BoxProfile !== prevProps.currentUser3BoxProfile) {
      this.setState({ currentUser3BoxProfile });
    }

    // if box is updated in parent, update component state
    const prevBoxEmpty = !prevProps.box || !Object.entries(prevProps.box).length;
    if (prevBoxEmpty && box && Object.entries(box).length > 0) {
      this.setState({ box });
    }
  }

  fetchMe = async () => {
    const { currentUserAddr } = this.props;
    const stateCurrentUserAddr = this.state.currentUserAddr;
    const myAddress = currentUserAddr || stateCurrentUserAddr;

    const currentUser3BoxProfile = await Box.getProfile(myAddress);
    this.setState({ currentUser3BoxProfile });
  }

  // get profiles of commenters from public api only on component mount
  fetchMessagers = async (uniqueUsers) => {
    const { profiles } = this.state;

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
    this.setState({ profiles });
  }

  openThread = async () => {
    const { box, ethereum } = this.state;
    const { loginFunction } = this.props;

    const noWeb3 = (!ethereum || !Object.entries(ethereum).length) && !loginFunction;
    if (noWeb3) return;
    // add error message

    this.setState({ threadLoading: true });

    if (!box || !Object.keys(box).length) loginFunction ? await loginFunction() : await this.openBox();
    await this.joinThread();

    this.setState({ threadLoading: false });
  }

  openBox = async () => {
    const {
      ethereum
    } = this.state;
    if (!ethereum) console.error('You must provide an ethereum object to the comments component.');

    const addresses = await ethereum.enable();
    const currentUserAddr = addresses[0];
    this.setState({ currentUserAddr }, async () => await this.fetchMe());

    const box = await Box.openBox(currentUserAddr, ethereum, {});

    box.onSyncDone(() => this.setState({ box }));
    this.setState({ box });
  }

  joinThread = async () => {
    const {
      spaceName,
      threadName,
      spaceOpts,
    } = this.props;
    const stateBox = (this.state.box && Object.keys(this.state.box).length) && this.state.box;
    const propBox = (this.props.box && Object.keys(this.props.box).length) && this.props.box;
    const box = stateBox || propBox;
    const space = await box.openSpace(spaceName, spaceOpts || {});
    const opts = {
      ghost: true
    };
    const thread = await space.joinThread(threadName, opts);

    const dialogue = await thread.getPosts();
    thread.onUpdate(() => this.updateComments());
    this.setState({
      thread,
      dialogue,
      threadJoined: true
    });
  }

  updateComments = async () => {
    const {
      thread,
      uniqueUsers
    } = this.state;
    const dialogue = await thread.getPosts();

    // if there are new messagers, fetch their profiles
    const updatedUniqueUsers = [...new Set(dialogue.map(x => x.author))];
    if (uniqueUsers.length === updatedUniqueUsers.length) {
      this.setState({
        dialogue,
        dialogueLength: dialogue.length
      });
    } else {
      await this.fetchMessagers(updatedUniqueUsers);
      this.setState({
        dialogue,
        dialogueLength: dialogue.length
      });
    }
  }

  _onMessageWasSent = async (message) => {
    await this.postMessage(message);
  }

  _handleClick = () => {
    this.setState({
      isOpen: !this.state.isOpen,
      newMessagesCount: 0
    });
  }

  postMessage = async (message) => {
    try {
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
    } = this.state;
    const isOpen = this.props.hasOwnProperty('isOpen') ? this.props.isOpen : this.state.isOpen;

    if (popupChat) {
      return (
        <Launcher
          onMessageWasSent={this._onMessageWasSent}
          handleClick={this._handleClick}
          openThread={this.openThread}
          agentProfile={agentProfile}
          messageList={dialogue}
          showEmoji={showEmoji}
          currentUserAddr={currentUserAddr}
          currentUser3BoxProfile={currentUser3BoxProfile}
          profiles={profiles}
          threadLoading={threadLoading}
          threadJoined={threadJoined}
          colorTheme={colorTheme}
          isOpen={isOpen}
        />
      );
    }

    return (
      <ChatWindow
        onUserInputSubmit={this._onMessageWasSent}
        openThread={this.openThread}
        messageList={dialogue}
        agentProfile={agentProfile}
        isOpen={isOpen}
        showEmoji={showEmoji}
        profiles={profiles}
        currentUser3BoxProfile={currentUser3BoxProfile}
        currentUserAddr={currentUserAddr}
        threadJoined={threadJoined}
        threadLoading={threadLoading}
        notPopup
      />
    )
  }
}

export default ChatBox;

ChatBox.propTypes = {
  chatName: PropTypes.string,

  currentUserAddr: PropTypes.string,
  userProfileURL: PropTypes.func,
  members: PropTypes.bool,
  box: PropTypes.object,
  spaceOpts: PropTypes.object,
  agentProfile: PropTypes.object,
  ethereum: PropTypes.object,
  threadOpts: PropTypes.object,
  currentUser3BoxProfile: PropTypes.object,
  useHovers: PropTypes.bool,
  loginFunction: PropTypes.func,
  spaceName: PropTypes.string.isRequired,
  threadName: PropTypes.string.isRequired,
  adminEthAddr: PropTypes.string.isRequired,
};

ChatBox.defaultProps = {
  chatName: '',
  currentUserAddr: '',
  agentProfile: null,
  members: false,
  useHovers: false,
  userProfileURL: null,
  box: null,
  ethereum: null,
  currentUser3BoxProfile: null,
  threadOpts: null,
  spaceOpts: null,
  loginFunction: null,
};