import * as React from "react";

declare class ChatBox extends React.Component<ChatBoxProps, any> { }

interface ChatBoxProps {
  box?: [any];
  spaceOpts?: [any];
  threadOpts?: [any];
  loginFunction?: [any];
  ethereum?: [any];
  currentUser3BoxProfile?: [any];

  mute?: boolean;
  popupChat?: boolean;
  showEmoji?: boolean;

  colorTheme: string;
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