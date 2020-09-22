import React, { Component } from "react";
import { Link } from "react-router-dom";
import  AuthService from "../services/AuthService"
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


  login(){
    AuthService.login(this.state.inp).then((r)=>{
      console.log(r);
      if(!r.data.id){
        this.state.errors = {}
        r.data.forEach((item)=>{
          this.state.errors[item.param]=item.msg
        })
        this.setState({})
        console.log(this.state.errors);
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
  render() {
    return (
      <div>
        <div className="w-25 mx-auto text-center">
        <h1 className="m-2 w-100"><Link className="w-50 btn btn-info" to="/signin">Sign in</Link>  <Link className="w-25 btn btn-secondary" to="/">Sign up</Link> </h1>
          {this.props.location.state ? (
            <h3 className=" alert alert-success">{this.props.location.state}</h3>
          ) : null}
          <input
            type="text"
            placeholder="Enter your email"
            className="form-control m-2"
            value={this.state.inp.email}
            data-id="email"
            onChange={this.change.bind(this)}
          />
            {this.state.errors.email ? (
            <div className="alert alert-danger m-2 w-100">{this.state.errors.email}</div>
          ) : null}
          <input
            type="password"
            placeholder="Enter your password"
            className="form-control m-2"
            value={this.state.inp.password}
            data-id="password"
            onChange={this.change.bind(this)}
          />

          {this.state.errors.password ? (
            <div className="alert alert-danger m-2 w-100">{this.state.errors.password}</div>
          ) : null}

          <button onClick={this.login.bind(this)} className="btn btn-info m-2">Sign in</button>
          {/* <Link to="/">Don't registered yet? Register</Link> */}
        </div>
      </div>
    );
  }
}

export default Signin;
