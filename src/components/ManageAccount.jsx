import React, { Component } from 'react'
import UserService from "../services/UserService"

class ManageAccount extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      data:{
        name:"",
        surname:"",
        age:"",
      },
      errors:{},


    }
  }
  componentDidMount(){
    UserService.getUserData().then((r)=>{
      if (r.data.id) {
         this.state.data=r.data
        this.setState({})
      }
      else{
        this.props.history.push("/signin","Please Log in")
      }
    })
  }
  change(e) {
    this.state.data[e.target.getAttribute("data-id")] = e.target.value;
    this.setState({});
  }
  edit(){
    UserService.edit(this.state.data)
    .then(r=>{
      console.log(r);
        if (r.data.length!==0) {
          this.state.errors = {}
          r.data.forEach((item)=>{
              this.state.errors[item.param]=item.msg
            })
            this.setState({})
            console.log(this.state.errors);
          }
          else{
        this.state.errors = {}
        this.setState({})
        this.props.history.push("/profile","Data changed successfully")
      }
    })
  }

  render() {
    return (
      <div className="w-25 mx-auto text-center">
        <h1>Manage your Account</h1>
        <div>
        <input
            type="text"
            placeholder="Enter your name"
            className="form-control m-2"
            value={this.state.data.name}
            data-id="name"
            onChange={this.change.bind(this)}
          />
          {this.state.errors.name ? (
          <div className="alert alert-danger m-2 w-100">{this.state.errors.name}</div>
          ) : null}
          <input
            type="text"
            placeholder="Enter your surname"
            className="form-control m-2"
            value={this.state.data.surname}
            data-id="surname"
            onChange={this.change.bind(this)}
          />
            {this.state.errors.surname ? (
            <div className="alert alert-danger m-2 w-100" >{this.state.errors.surname}</div>
          ) : null}

          <input
            type="text"
            placeholder="Enter your age"
            className="form-control m-2"
            value={this.state.data.age}
            data-id="age"
            onChange={this.change.bind(this)}
          />
            {this.state.errors.age ? (
            <div className="alert alert-danger m-2 w-100">{this.state.errors.age}</div>
          ) : null}
        </div>
        <button onClick={this.edit.bind(this)} className="btn btn-primary  ">Edit</button>
      </div>
    )
  }
}

export default ManageAccount
