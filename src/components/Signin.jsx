import React, { Component } from "react";
import  AuthService from "../services/AuthService"
import '../CSS/sign.css';
import Signup from "./Signup";
import { Link } from "react-router-dom";

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inp: {
        email: "",
        password: "",
      },
      errors:{}
    };
  }
  change(e) {
    this.state.inp[e.target.getAttribute("data-id")] = e.target.value;
    this.setState({});
  }
  sendWithEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.login()
    }
  }

  login(){
    AuthService.login(this.state.inp).then((r)=>{
      if(!r.data.id){
        this.state.errors = {}
        r.data.forEach((item)=>{
          this.state.errors[item.param]=item.msg
        })
        this.setState({})
      }
      else{
        this.state.errors={};
        this.state.inp={
          email:"",
          password:"",
        };
        this.setState({})
        if (r.data.accessToken) {
          localStorage.setItem("user",JSON.stringify(r.data))          
        }
        this.props.history.push("/profile")
      }
    })
  }
  logTab(name,e) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(name).style.display = "block";
    e.target.className += " active";
  }
  render() {
    return (
      <div>
        <div className="header grid-container">
          <div className="profile">
            <h3><Link  to="/profile">CatChat </Link></h3>
          </div>
        </div>
        <div className="cont">
          <div className="tab">
            <button className="tablinks active" onClick={this.logTab.bind(this,"Sign In")}>  Sign In</button>
            <button className="tablinks" onClick={this.logTab.bind(this, "Sign Up")}> Sign Up</button>
          </div>

          <div id="Sign In" className="tabcontent " style={{display:"block"}}>

                {this.props.location.state ? (
                  <div className="noth">{this.props.location.state}</div>
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
              <button onClick={this.login.bind(this)} className="Button">Sign in</button>
              </div>
          <div id="Sign Up" className="tabcontent" >
              <Signup></Signup>
          </div>
        </div>
    </div>
    );
  }
}

export default Signin;
