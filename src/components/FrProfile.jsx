import React, { Component } from 'react'
import FriendSarvice from "../services/FriendSarvice"
class FrProfile extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             data:{}
        }
    }
    
    componentDidMount(){
        FriendSarvice.getData(this.props.match.params.id).then((r)=>{
        }
        )
    }
    render() {
        return (
            <div>
                <h1>profile</h1>
            </div>
        )
    }
}

export default FrProfile
