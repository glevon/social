import '../CSS/Chat.css';
import React, { Component } from 'react'
import ReactDOM  from "react-dom"

class Chat extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             mess:"",
             date:"",
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
                                {this.props.data.name }{this.props.data.surname}
                            </h5>
                        </div>
                        <div>
                            <i class="fa fa-close btn" style={{color:"white"}} onClick={this.props.close.bind(this)} aria-hidden="true"></i>

                        </div>
                    </div>
                    <div className="chat_body" ref={el=>{
                        this.messBox=el;
                    }}>
                    {
                    this.props.mess.map(a => (
                        <div key={a.id} className={a.me ? "myMessage" : "yourMessage"}>
                            <h6>{a.message}</h6>
                            <h6 className="time">
                                <i >{(new Date(a.time)).getDate()}-{((new Date(a.time)).getMonth()+1)}-
                                { (new Date(a.time)).getFullYear()} {(new Date(a.time)).getHours() }: 
                                {(new Date(a.time)).getMinutes()}</i>
                            </h6>
                        </div>
                    ))
                    }
                    </div>
                    <div className="chat_footer">
                        <input onKeyDown={this.sendWithEnter.bind(this)} className="chat-inp" placeholder="type  message..." value={this.state.mess} onChange={this.change.bind(this)}/>
                        <button onClick={this.send.bind(this)} className="chat-button">
                        <i className="fa fa-paper-plane" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Chat

