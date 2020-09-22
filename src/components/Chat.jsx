import '../CSS/Chat.css';

import React, { Component } from 'react'
import ReactDOM  from "react-dom"

class Chat extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             mess:""
        };
        this.messBox="";
    }
    componentDidMount() {
        this.scrollToBottom();
      }
      componentDidUpdate() {
        this.scrollToBottom();
      }
      scrollToBottom() {
        let el = ReactDOM.findDOMNode(this.messBox);
        el.scrollTop = el.scrollHeight;
      }
    change(e){
        this.state.mess=e.target.value;
        this.setState({})
    }
    send(){
        this.props.send(this.state.mess,this.props.data.id)
        this.state.mess="";
        this.setState({})
    }
    sendWithEnter(e) {
        if (e.key == "Enter") {
        e.preventDefault();
        this.send();
        }
    }
    render() {
        return (
            <div>
                <div className="chat">
                    <div className="chat_header">
                        <div className="fr_data">
                            <h5>
                                {this.props.data.name}{this.props.data.surname}
                            </h5>
                        </div>
                        <button className="btn btn-warning" onClick={this.props.close.bind(this)}>
                        <i className="fa fa-window-close-o" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className="chat_body" ref={el=>{
                        this.messBox=el;
                    }}>
                    {
                    this.props.mess.map(a => (
                        <div key={a.id} className={a.me ? "myMessage" : "yourMessage"}>
                            <h5>{a.message}</h5>
                            <p>
                                <i>{a.time}</i>
                            </p>
                        </div>
                    ))
                    }
                    </div>
                    <div className="chat_footer">
                        <textarea onKeyDown={this.sendWithEnter.bind(this)} className="form-control" placeholder="type  messige..." value={this.state.mess} onChange={this.change.bind(this)}></textarea>
                        <button onClick={this.send.bind(this)} className="btn btn-info">
                        <i className="fa fa-paper-plane" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Chat

