import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/AuthService"
import '../CSS/sign.css';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inp: {
        name: "",
        surname: "",
        email: "",
        age: "",
        password: "",
        confirm_password: "",
      },
      errors:{},
    };
  }
  change(e) {
    this.state.inp[e.target.getAttribute("data-id")] = e.target.value;
    this.setState({});
  }
  sendWithEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.register()
    }
  }
  register(){
    AuthService.register(this.state.inp)
    .then(r=>{
      if (r.data.length!==0) {
        this.state.errors = {}
        r.data.forEach((item)=>{
          this.state.errors[item.param]=item.msg
        })
        this.setState({})
      }
      else{
        this.state.errors = {}
        this.state.inp={
          name: "",
          surname: "",
          email: "",
          age: "",
          password: "",
          confirm_password: "",
        }
        this.setState({})
        this.props.history.push("/signin","Regidtered successfully")
      }
    })
  }
  render() {
    return (
      <div>
          <input
            type="text"
            placeholder="Enter your name"
            className="inp"
            value={this.state.inp.name}
            data-id="name"
            onChange={this.change.bind(this)}
            onKeyDown={e=>this.sendWithEnter(e)}

          />
            {this.state.errors.name ? (
            <div className="noth">{this.state.errors.name}</div>
          ) : null}
          <input
            type="text"
            placeholder="Enter your surname"
            className="inp"
            value={this.state.inp.surname}
            data-id="surname"
            onChange={this.change.bind(this)}
            onKeyDown={e=>this.sendWithEnter(e)}

          />
            {this.state.errors.surname ? (
            <div className="noth" >{this.state.errors.surname}</div>
          ) : null}
          <input
            type="text"
            placeholder="Enter your email"
            className="inp"
            value={this.state.inp.email}
            data-id="email"
            onChange={this.change.bind(this)}
            onKeyDown={e=>this.sendWithEnter(e)}

          />
            {this.state.errors.email ? (
            <div className="noth">{this.state.errors.email}</div>
          ) : null}
          <input
            type="text"
            placeholder="Enter your age"
            className="inp"
            value={this.state.inp.age}
            data-id="age"
            onChange={this.change.bind(this)}
            onKeyDown={e=>this.sendWithEnter(e)}

          />
            {this.state.errors.age ? (
            <div className="noth">{this.state.errors.age}</div>
          ) : null}
          <input
            type="password"
            placeholder="Enter your password"
            className="inp"
            value={this.state.inp.password}
            data-id="password"
            onChange={this.change.bind(this)}
            onKeyDown={e=>this.sendWithEnter(e)}

          />
            {this.state.errors.password ? (
            <div className="noth">{this.state.errors.password}</div>
          ) : null}
          <input
            type="password"
            placeholder="Confirm your password"
            className="inp"
            value={this.state.inp.confirm_password}
            data-id="confirm_password"
            onChange={this.change.bind(this)}
            onKeyDown={e=>this.sendWithEnter(e)}

          />
            {this.state.errors.confirm_password ? (
            <div className="noth">{this.state.errors.confirm_password}</div>
          ) : null}

          <button className="Button" onClick={this.register.bind(this)} >Sign up</button>
      </div>
    );
  }
}

export default Signup;
