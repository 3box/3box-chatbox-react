import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

import { shortenEthAddr, memo } from '../../utils';

import LikeIcon from "../icons/LikeIcon"
import makeBlockie from 'ethereum-blockies-base64';

const makeBlockieMemoized = memo(makeBlockie)


class LikersList extends Component {
    constructor(props) {
        super(props)

    }

    render() {
        const { likers, showLikers, hideLikers } = this.props

        if (!likers) return null

        return (
            <div className="sc-message-likers-wrapper"
                onMouseEnter={showLikers}
                onMouseLeave={hideLikers}

            >
                {likers.slice(0, 5).map((profile, i) => {

                    const profilePicture = (profile && profile.ethAddr) &&
                        (profile.image ? `https://ipfs.infura.io/ipfs/${profile.image[0].contentUrl['/']}`
                            : makeBlockieMemoized(profile.ethAddr));

                    return <a key={i}
                        href={profile.profileURL}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <img
                            className="sc-message--liker-avatar"
                            src={profilePicture}
                            alt={shortenEthAddr(profile.ethAddr)}
                            title={profile.name ? `${profile.name} ${shortenEthAddr(profile.ethAddr)}` : `${shortenEthAddr(profile.ethAddr)}`}
                        />
                    </a>
                })}
            </div>
        )
    }
}


function isLikedByCurrUser(likers, currentUserAddr) {
    if (!likers || !currentUserAddr) return false
    return new Set(likers.map(author => author.ethAddr.toLowerCase())).has(currentUserAddr.toLowerCase())
}

class Like extends Component {
    constructor(props) {
        super(props);

        const { likers, currentUserAddr } = this.props

        this.state = {
            liked: isLikedByCurrUser(likers, currentUserAddr),
            showLikers: false,
            enterTimer: null,
            leaveTimer: null
        }

        this.ref = createRef()

    }

    componentDidUpdate() {
        //change absolute positioning if it causes overflow
        const chatWindow = document.querySelector(".sc-chat-window")
        const likers = this.ref.current.querySelector(".sc-message-likers-wrapper")
        if (likers && chatWindow) {
            if (likers.getBoundingClientRect().right > chatWindow.getBoundingClientRect().right) {
                likers.style.right = "0px"
            }
        }
    }

    componentWillUnmount() {
        const { enterTimer, leaveTimer } = this.state
        clearTimeout(enterTimer)
        clearTimeout(leaveTimer)
    }

    clickHandler = (e) => {
        e.preventDefault()

        const { sendMessage, messageObj } = this.props


        sendMessage({
            author: 'me',
            type: 'text',
            data: { text: `/${this.state.liked ? "un" : ""}like ${messageObj.postId}` }
        })

        this.setState((state) => {
            return { ...state, liked: !state.liked }
        })

    }

    showLikers = () => {
        clearTimeout(this.state.leaveTimer)
        const enterTimer = setTimeout(() => {
            this.setState({ showLikers: true })
        }, 350)
        this.setState({ enterTimer })
    }

    hideLikers = () => {
        clearTimeout(this.state.enterTimer)
        const leaveTimer = setTimeout(() => {
            this.setState({ showLikers: false })
        }, 250)
        this.setState({ leaveTimer })
    }

    render() {
        const { likers } = this.props
        return (
            <div className="sc-message-like-wrapper" title="" ref={this.ref}>
                {this.state.showLikers && likers &&
                    <LikersList likers={likers} showLikers={this.showLikers} hideLikers={this.hideLikers} />
                }

                <div
                    className="sc-message-like-container"
                    onMouseEnter={this.showLikers}
                    onMouseLeave={this.hideLikers}
                >

                    <LikeIcon onClick={this.clickHandler} isLiked={this.state.liked} />
                    <div> {likers && likers.length} </div>
                </div>
            </div>


        )
    }
}

Like.propTypes = {
    likers: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
    sendMessage: PropTypes.func,
    messageObj: PropTypes.object,
    currentUserAddr: PropTypes.string,
};

LikersList.propTypes = {
    likers: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
    showLikers: PropTypes.func,
    hideLikers: PropTypes.func
}

export default Like