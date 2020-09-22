import React, { Component } from "react";
import Chat from "./Chat"
import UserService from "../services/UserService"
import { Link } from "react-router-dom";
import '../CSS/Profile.css';
import io from "socket.io-client"
class Profile extends Component {
  constructor(props) {
    super(props)
    this.socket=""
    this.state = {
      data:{},
      hide:"none",
      inp: {
        old_password: "",
        new_password: "",
        new_confirm_password: "",
      },
      errors:{},
      profPic:"",
      search:"",
      users:[],
      requests:[],
      postInp:{
        post:"",
        pic:""
      },
      posts:[],
      inp_comment:{},
      friends:[],
      myRequests:[],
      openChat:false,
      chatFrData:{},
      messages:[]
    }
  }
  componentDidMount(){

    UserService.getUserData().then((r)=>{
    if (r.data.id) {
       this.state.data=r.data
       UserService.getPost().then((r)=>{
        this.state.posts=r.data
        this.setState({})
        UserService.getFriends().then((r)=>{
          this.state.friends=r.data
          this.setState({})

          UserService.getMyRequests().then((r)=>{
            this.state.myRequests=r.data
            this.setState({})
            this.socket=io.connect("http://localhost:8000",{
              query:`id=${this.state.data.id}`
            })
          })
        })
      })

    }
    else{
      this.props.history.push("/signin","Please Log in")
    }
  })
  }
  logout(){
    window.localStorage.removeItem('user');
    this.props.history.push("/signin","Please Log in")
  }
  toggle(){
    if (this.state.hide==="none") {
      this.state.hide="block"
    } else {
      this.state.hide="none"
    }
    this.setState({})

  }
  change(e){
      this.state.inp[e.target.getAttribute("data-id")] = e.target.value;
      this.setState({});
  }
  changePost(e){
    if (e.target.getAttribute("data-id")==="pic") {
      this.state.postInp[e.target.getAttribute("data-id")] = e.target.files[0];
    } else {
      this.state.postInp[e.target.getAttribute("data-id")] = e.target.value;
    }
    this.setState({});
  }
  changeSearch(e) {
    this.state.users = [];
    this.state[e.target.getAttribute("data-id")] = e.target.value;
    this.setState({});
    UserService.search(this.state.search).then((r) => {
      if (this.state.search !== "") {
        r.data.forEach(e=>{
          e.status="ok"
          if (e.id===this.state.data.id) {
            e.status="me"
          }
          else{
            this.state.friends.forEach(k=>{
              if (e.id===k.userId||e.id===k.myId) {
                e.status="friend"
              }
            })
            this.state.myRequests.forEach(r=>{
              if (e.id===r.userId) {
                e.status="requested"
              }
            })
          }
        })
      this.state.users = r.data;
      this.setState({});

      }
    });
  }
  changeComment(id,e){
    this.state[e.target.getAttribute("data-id")].id= e.target.value;
    this.setState({});
  }
  changePhoto(e){
    this.state[e.target.getAttribute("data-id")] = e.target.files[0];
    this.setState({});
}
addProfPic(){
  let formData= new FormData()
  formData.append("profPic",this.state.profPic)
  UserService.addProf(formData).then((r)=>{
    this.state.data.photo=r.data.filename
    this.state.hide="none"
    this.setState({})

  })
}
addPost(){
  let formData= new FormData()
  formData.append("post",this.state.postInp.post)
  formData.append("pic",this.state.postInp.pic)
  console.log("AAAAAAAAAAAA");
  UserService.addPost(formData).then((r)=>{
    console.log("posted");
  })
}
  changePassword(){
    UserService.changePassword(this.state.inp)
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
          this.setState({})
          window.localStorage.removeItem('user');
          this.props.history.push("/signin","Password changed successfully. Please Sign in")
        }
    })
  }
  addFriend(id){
    UserService.addFriend(id)
    .then((r)=>{
      this.state.users.find(a=>a.id===id).status="requested"
      this.setState({})
    })
  }
  addComment(id){
    UserService.addComment(this.state.inp_comment.id,id).then((r)=>{
      this.state.posts.map((a)=>{
        if (a.id===id) {
          r.data.user=this.state.data
          // console.log(this.state.data);
          a.comments.push(r.data);
          // console.log(a);
        }
      })
      this.setState({})
    })
  }


  note(){
    UserService.note()
    .then((r)=>{
      this.state.requests=r.data
      this.setState({})
    })
  }
  accept(id){
    UserService.accept(id)
    .then((r)=>{
      this.note.bind(this)
      this.setState({})
    })
  }

  delete(id){
    UserService.delete(id)
    .then((r)=>{
      this.note.bind(this)
      this.setState({})
    })
  }
  addLike(postId,e) {
    console.log(e.target.classList);
    // e.target.classList.toggle("fa-thumbs-down");
    UserService.addLike(postId).then((r)=>{
      this.state.posts.map((a)=>{
          if (a.id===postId) {
              r.data.user=this.state.data
              a.likes.push(r.data);
            console.log("Added");
            }
        })
        this.setState({})
      })
    }
  delLike(postId,e) {
    // e.target.classList.toggle("fa-thumbs-up");
    console.log("aaaaaaaaaaa");
    UserService.delLike(postId).then((r)=>{
      console.log("deleted");
      this.state.posts.map((a)=>{
        if (a.id===postId) {
          console.log(a);
          console.log(postId);
          // let index = a.indexOf();
          // a.splice(index, 1);
          }
      })
      this.setState({})
    })

  }
  openMess(a) {
    this.socket=io.connect("http://localhost:8000",{
      query:`id=${this.state.data.id}`
    })
    this.state.messages=[]
    this.state.openChat = true 
    if (this.state.data.id !== a.uxarkox.id) {
      this.state.chatFrData=a.uxarkox;
    } else {
      this.state.chatFrData=a.stacox 

    }
    this.setState({})

    UserService.getMessages(this.state.chatFrData.id).then((r)=>{
      r.data.forEach((a) => {
        if (a.myId === this.state.data.id) {
          this.state.messages.push({
            me: true,
            message: a.message,
            time: a.time,
            photo: a.photo,
            id: a.id,
          });
        } else {
          this.state.messages.push({
            me: false,
            message: a.message,
            time: a.time,
            photo: a.photo,
            id: a.id,
        });
        }
        this.setState({})
      })
      console.log(this.state.messages);
    })
    this.socket.on("showMyMessages", (data) => {
      this.state.messages.push({
        me: true,
        message: data.message.message,
        time: data.message.time,
        id: data.message.id,
      });
      this.setState({})
    });
    this.socket.on("showYourMessages", (data) => {
      this.state.messages.push({
        me: false,
        message: data.message.message,
        time: data.message.time,
        id: data.message.id,
      });
      this.setState({})
    });

  }
  close(){
    this.state.openChat = false ;
    this.setState({})
    this.socket.disconnect()
  }
  removeReq(id){
    UserService.removeReq(id)
    .then((r)=>{
      this.state.users.find(a=>a.id===id).status="ok"
      this.setState({})
    })
  }
  
  
  send(message,userId){
    this.socket.emit("send_message",
    {
      message,
      userId,
      myId:this.state.data.id,
    }
    )
  }
  
  render() {
    return (
      <div>
          <div className="navi">
            <nav className="navbar navbar-expand-sm ">
            <ul className="navbar-nav">
              <li className="nav-item w-100 mh-100">
              <Link className="nav-link" to="/profile">Profile </Link>
              </li>
            </ul>
            <div className="search">
              <input  type="text"  placeholder="Search people" className="form-control right m-1" value={this.state.search} data-id="search" onChange={this.changeSearch.bind(this)}/>      
              <div style={{ width: "100%", minHeight: "1px",  background: "#9797ca",bottom:"auto", position:"absolute" }} className="m-1"  >
                {this.state.users.map((a) => (
                  <div key={a.id}>
                    <img src={`http://localhost:8000/images/${a.photo}` }  alt=""  height="70px" width="70px"/>
                    <b><p><Link to={`/friend/${a.id}/profile`}> {a.name} {a.surname} </Link>  </p></b>
                    {
                      a.status==="ok"?(<button className="btn btn-info" onClick={this.addFriend.bind(this,a.id)}>Add</button>):
                        a.status==="friend"?(<button className="btn btn-warning" >Friends</button>):
                        a.status==="requested"?(<button className="btn btn-danger" onClick={this.removeReq.bind(this,a.id)}>Remove request</button>):(
                           <button className="btn btn-warning" >Me</button>  ) 
                    }
                  </div>
                ))}
              </div>
            </div>
            <div className="note" onClick={this.note.bind(this)} type="button" data-toggle="modal" data-target="#myModal">
              <i className="fa fa-bell" style={{fontSize:"36px"}} aria-hidden="true"></i>
            </div>
            <button className="user" onClick={this.toggle.bind(this)}>
              <img className="img" src={`http://localhost:8000/images/${this.state.data.photo}`} alt="http://localhost:8000/images/unknown.png"/>
            </button>
            </nav>
            </div>
 

        <div className="myDIV" style={{display: this.state.hide,zIndex:"2"}}>
          <img  className="img" src={`http://localhost:8000/images/${this.state.data.photo}`} alt=""/>
          <div data-toggle="modal" data-target="#exampleModalCenter1" className="im-up">
              <img className="img" src="https://www.clipartmax.com/png/small/281-2810310_png-file-cloud-upload-icon.png" alt="http://localhost:8000/images/unknown.png"/>
          </div>
          <h3>{this.state.data.name} {this.state.data.surname}</h3>
          <h3>{this.state.data.email}</h3>
          <Link className="btn btn-primary p-2 " to="/profile/edit"> Manage your Account </Link>
          <button  className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
          Change Password
           </button>
          <button  onClick={this.logout.bind(this)}  className="btn btn-secondary p-2">Logout</button>
        </div>       
        
        <div className="modal fade" id="exampleModalCenter1" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLongTitle">Change Password</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                      <div className="modal-body">
                          <input
                              type="file"
                              className="form-control m-2"
                              accept="image/*"
                              data-id="profPic"
                              onChange={this.changePhoto.bind(this)}
                          />
                    </div>
                    <div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                      <button onClick={this.addProfPic.bind(this)}  type="button" className="btn btn-primary">Add Propile pic</button>
                    </div>
                  </div>
                </div>
          </div>
      </div>
<div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
<div className="modal-dialog modal-dialog-centered" role="document">
  <div className="modal-content">
    <div className="modal-header">
      <h5 className="modal-title" id="exampleModalLongTitle">Change Password</h5>
      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div className="modal-body">
    <input
      type="password"
      placeholder="Enter your old password"
      className="form-control m-2"
      value={this.state.inp.old_password}
      data-id="old_password"
      onChange={this.change.bind(this)}
    />
      {this.state.errors.old_password ? (
      <div className="alert alert-danger m-2 w-100">{this.state.errors.old_password}</div>
    ) : null}
    <input
      type="password"
      placeholder="Enter your new password"
      className="form-control m-2"
      value={this.state.inp.new_password}
      data-id="new_password"
      onChange={this.change.bind(this)}
    />
      {this.state.errors.new_password ? (
      <div className="alert alert-danger m-2 w-100">{this.state.errors.new_password}</div>
    ) : null}
    <input
      type="password"
      placeholder="Confirm your new password"
      className="form-control m-2"
      value={this.state.inp.new_confirm_password}
      data-id="new_confirm_password"
      onChange={this.change.bind(this)}
    />
      {this.state.errors.new_confirm_password ? (
      <div className="alert alert-danger m-2 w-100">{this.state.errors.new_confirm_password}</div>
    ) : null}
    </div>
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
      <button onClick={this.changePassword.bind(this)}  type="button" className="btn btn-primary">Save changes</button>
    </div>
  </div>
</div>
</div>

{/* <!-- The Modal --> */}
  <div className="modal fade" id="myModal">
    <div className="modal-dialog">
      <div className="modal-content">
      
        {/* <!-- Modal Header --> */}
        <div className="modal-header">
          <h4 className="modal-title">Notification</h4>
          <button type="button" className="close" data-dismiss="modal">×</button>
        </div>
        
        {/* <!-- Modal body --> */}
        <div className="modal-body">
        {this.state.requests.map((a) => (
          <div key={a.id}>
            <img
              src={`http://localhost:8000/images/${a.photo}` }
              alt=""
              height="70px"
              width="70px"
            />
            <b>
              <p>
                {a.name}
                {a.surname}
              </p>
            </b>
            <button className="btn btn-success" onClick={this.accept.bind(this,a.id)}>Accept</button>
            <button className="btn btn-danger" onClick={this.delete.bind(this,a.id)}>Delete</button>
          </div>
        ))}
        </div>
        
        {/* <!-- Modal footer --> */}
        <div className="modal-footer">
          <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
        </div>
        
      </div>
    </div>
  </div>

          <div className="row" >
            <div className="col-3">
              <h1>Profile</h1>
              <h1>{this.state.data.name}</h1>
              <h6>{this.state.data.email}</h6>
              <div className="alert-warning">
                <h4>My friends</h4>
                {this.state.friends.map((a) => (
                  <div key={a.id} className="alert-success">
                      <div>
                      {a.uxarkox.id !== this.state.data.id ? (
                        <h5 className="text-danger">
                          {a.uxarkox.name}
                          {a.uxarkox.surname}
                        </h5>
                      ) : (<h5 className="text-danger">
                        {a.stacox.name}
                        {a.stacox.surname}
                      </h5>)
                      }
                      <button className="btn btn-success" onClick={this.openMess.bind(this,a)}>
                          <i
                            className="fa fa-comments"
                            style={{ "fontSize": "20px", color: "red" }}
                            aria-hidden="true"
                          ></i>
                        </button>
                      </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-6">
              <div >
              {this.state.posts.map((a)=>(
                <div key={a.id} className="">
                  <div>
                    <img src={`http://localhost:8000/images/${a.user.photo}`}alt=""  height="25px" width="25px"/>
                     { a.user.name}{ a.user.surname}
                      {a.pic !== "" ? (<img src={`http://localhost:8000/images/${a.pic}`}alt=""  height="70px" width="70px"/>):""}
                      <h1>{a.post}
                        {a.likes.find(a=>a.userId===this.state.data.id)?(
                        <i onClick={this.delLike.bind(this,a.id)} className="fa fa-thumbs-up fa-thumbs-down " style={{float:"right"}}>
                          {a.likes.length}
                        </i>
                        ):(
                          <i onClick={this.addLike.bind(this,a.id)} className="fa fa-thumbs-up" style={{float:"right"}}>
                          {a.likes.length}
                          </i>
                        )
                        }
                  </h1>
                  </div>
                  <p>Comments</p>
                  <hr/>
                  <div style={{maxHeight:"180px", overflow: "auto",background: "lightblue"}}>
                  {a.comments.map((comm)=>(
                    <div key={comm.id} className="m-4" >
                      <img src={`http://localhost:8000/images/${comm.user.photo}`}alt=""  height="25px" width="25px"/>
                      { comm.user.name}{ comm.user.surname}
                      <h2 > {comm.comment }
                      </h2>
                      <h6 style={{float:"inline-end"}}>{comm.time}</h6>
                      <hr/>
                    </div>
                  ))}
                  </div>
                  <hr/>
                  Add Comment:<input
                        type="text"
                        placeholder="Add comment"
                        className="form-control right m-1"
                        value={this.state.inp_comment[a.id]}
                        data-id="inp_comment"
                        onChange={this.changeComment.bind(this,a.id)}
                        />  
                        <button className="btn btn-success" onClick={this.addComment.bind(this,a.id)}>Add</button>
                        <hr style={{height:"3px",borderWidth:"0",color:"gray",backgroundColor:"gray"}} />
                </div>
                ))}
              </div>
            </div>
            <div className="col-3">
              <div className="alert-success w-50">
                <textarea
                  data-id="post"
                  value={this.state.postInp.post}
                  onChange={this.changePost.bind(this)}
                ></textarea>
                <input
                  type="file"
                  data-id="pic"
                  onChange={this.changePost.bind(this)}
                />
                <button onClick={this.addPost.bind(this)}>Publish</button>
              </div>
              {
                this.state.openChat?<Chat send={this.send.bind(this)} data={this.state.chatFrData} mess={this.state.messages} close={this.close.bind(this)}></Chat>:null
              }
              
            </div>
        </div>        

      </div>
    );
  }
}

export default Profile;
