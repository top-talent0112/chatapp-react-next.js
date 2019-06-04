import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';

class Chat extends Component {

    state = { chats: [] }
    
    componentDidMount() {
    
    this.pusher = new Pusher(process.env.PUSHER_APP_KEY, {
        cluster: process.env.PUSHER_APP_CLUSTER,
        encrypted: true
    });
    
    this.channel = this.pusher.subscribe('chat-room');
    
    this.channel.bind('new-message', ({ chat = null }) => {
        const { chats } = this.state;
        chat && chats.push(chat);
        this.setState({ chats });
    });
    
    this.pusher.connection.bind('connected', () => {
        axios.post('/messages')
        .then(response => {
            const chats = response.data.messages;
            this.setState({ chats });
        });
    });
    
    }
    
    componentWillUnmount() {
    this.pusher.disconnect();
    }
    
}

export default Chat;