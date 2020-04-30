import * as React from "react";

declare class ChatBox extends React.Component<ChatBoxProps, any> { }

interface ChatBoxProps {
  box?: [any];
  spaceOpts?: [any];
  loginFunction?: [any];
  ethereum?: [any];
  currentUser3BoxProfile?: [any];

  mute?: boolean;
  popupChat?: boolean;
  showEmoji?: boolean;
  openOnMount?: boolean;

  colorTheme?: string|boolean;
  currentUserAddr?: string;

  agentProfile: {
    chatName?: string,
    imageUrl?: string,
  };

  userProfileURL?: (url: string) => string;

  spaceName: string;
  threadName: string;
}

export default ChatBox;