import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/AuthService"
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
  register(){
    AuthService.register(this.state.inp)
    .then(r=>{
      
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
        <div className="w-25 mx-auto text-center">
          <div className="m-2 w-100 "><Link className="w-50 btn btn-info" to="/" >Sign up</Link>  <Link className="w-25 btn btn-secondary" to="/signin">Sign in</Link>           </div>
          <input
            type="text"
            placeholder="Enter your name"
            className="form-control m-2"
            value={this.state.inp.name}
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
            value={this.state.inp.surname}
            data-id="surname"
            onChange={this.change.bind(this)}
          />
            {this.state.errors.surname ? (
            <div className="alert alert-danger m-2 w-100" >{this.state.errors.surname}</div>
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
            type="text"
            placeholder="Enter your age"
            className="form-control m-2"
            value={this.state.inp.age}
            data-id="age"
            onChange={this.change.bind(this)}
          />
            {this.state.errors.age ? (
            <div className="alert alert-danger m-2 w-100">{this.state.errors.age}</div>
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
          <input
            type="password"
            placeholder="Confirm your password"
            className="form-control m-2"
            value={this.state.inp.confirm_password}
            data-id="confirm_password"
            onChange={this.change.bind(this)}
          />
            {this.state.errors.confirm_password ? (
            <div className="alert alert-danger m-2 w-100">{this.state.errors.confirm_password}</div>
          ) : null}

          <button className="btn btn-info m-2  " onClick={this.register.bind(this)} >Sign up</button>
          {/* <Link to="/signin">Already registered? Login</Link> */}
        </div>
      </div>
    );
  }
}

export default Signup;
