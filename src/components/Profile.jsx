import React, { Component } from "react";
import Chat from "./Chat"
import UserService from "../services/UserService"
import { Link } from "react-router-dom";
import '../CSS/Profile.css';
import '../CSS/Snackbar.css';
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
      messages:[],
      
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
          UserService.note()
          .then((r)=>{
            this.state.requests=r.data
            this.setState({})
          })

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
  sendWithEnter(e,id) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.addComment(id)
    }
  }
  toggle(){
    if (this.state.hide==="none") {
      this.state.hide="block"
    } else {
      this.state.hide="none"
    }
    this.setState({})
    
  }
  clickBody(){
    this.state.hide="none"
    this.setState({})

  }
  toggle_comment(id){
    let el=document.getElementsByClassName('hide_'+id)[0];
    if (el.style.display==="none") {
      el.style.display="block"
    } else {
      el.style.display="none"
    }
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
  UserService.addPost(formData).then((r)=>{
    this.state.postInp={post:"",  pic:""}
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
      this.snackbar("Password has successfuly changed")
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
          a.comments.push(r.data);
          this.state.inp_comment[id]=""
        }
      })
      this.setState({})
    })
  }
  
  snackbar(message) {
    var x = document.getElementById("snackbar");
    x.innerText=message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
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
      this.snackbar("Request is accepted")
      this.note()
      this.setState({})
    })
  }

  delete(id){
    UserService.delete(id)
    .then((r)=>{
      this.snackbar("Request is deleted")
      this.note()
      this.setState({})
    })
  }
  addLike(postId,e) {
    UserService.addLike(postId).then((r)=>{
      this.state.posts.map((a)=>{
          if (a.id===postId) {
              r.data.user=this.state.data
              a.likes.push(r.data);
            }
        })
        this.setState({})
      })
    }
  delLike(postId,e) {
    UserService.delLike(postId).then((r)=>{
      this.state.posts.map((a)=>{
        if (a.id===postId) {
          for (var i = 0; i < a.likes.length; i++) {
            if(a.likes[i].userId===this.state.data.id){
               a.likes.splice(i, 1);

            }
          }
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
      <div  >
        <div className="header grid-container">
          <div className="profile">
            <h3><Link  to="/profile">CatChat </Link></h3>
          </div>
          <div className="search">
            <input  type="text"  placeholder="Search people" className="form-control right " value={this.state.search} data-id="search" onChange={this.changeSearch.bind(this)}/>      
            <div className="search-div">
              {this.state.users.map((a) => (
                <div key={a.id} className="search-div-el">
                    <img className="img" src={`http://localhost:8000/images/${a.photo}`}  alt="" />
                    <div className="search-name">
                      <div className="search-div-name" ><Link to={`/friend/${a.id}/profile`}> {a.name} {a.surname} </Link> 
                        {
                          a.status==="friend"?(<p className="search-status">Friends</p>):
                          a.status==="me"?(<p className="search-status" >Me</p>):""
                        }
                      
                       </div>
                    </div>
                    {
                      a.status==="ok"?(<button className="search-but" onClick={this.addFriend.bind(this,a.id)}>Add Friends</button>):
                      a.status==="requested"?(<button className="search-but" onClick={this.removeReq.bind(this,a.id)}>Remove request</button>):""

                    }
                </div>
              ))}
            </div>
          </div>
          <div className="note" onClick={this.note.bind(this)} type="button" data-toggle="modal" data-target="#myModal">
            <i className="fa fa-bell" style={{fontSize:"36px"}} aria-hidden="true"></i>
                <span className="badge">{this.state.requests.length}</span>
          </div>
          <div className="user" onClick={this.toggle.bind(this)}>
            <img className="img" src={`http://localhost:8000/images/${this.state.data.photo}`} alt="http://localhost:8000/images/unknown.png"/>
          </div>
        </div>

        <div className="row" onClick={this.clickBody.bind(this)}>
          <div className="col-manu ">
            <div className="myData">
              <h1>{this.state.data.name}</h1>
              <h6>{this.state.data.email}</h6>
            </div>
            <div className="myFriends">
              <h1>My friends</h1>
              {this.state.friends.map((a) => (
                <div key={a.id} >
                    <div className="myFriends-chat">
                    {a.uxarkox.id !== this.state.data.id ? (
                      <p>
                        {a.uxarkox.name}
                        {a.uxarkox.surname}
                      </p>
                    ) : (<p>
                      {a.stacox.name}
                      {a.stacox.surname}
                    </p>)
                    }
                      <div
                        onClick={this.openMess.bind(this,a)}
                        className="fa fa-comments-o chat-icon"
                        aria-hidden="true"
                      ></div>
                    </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-post">
            <div className="postdiv" >
                <textarea
                placeholder="Add post"
                  data-id="post"
                  value={this.state.postInp.post}
                  onChange={this.changePost.bind(this)}
                ></textarea>
              
                <div className="upload_pic" >
                  <label >
                    <input type="file" data-id="pic" onChange={this.changePost.bind(this)} id="file-upload" style={{display:"none"}} />
                    <i className="fa fa-cloud-upload">Upload photo</i> 
                  </label> 
                </div>
                <button onClick={this.addPost.bind(this)} className="myButton">Publish</button>
            </div>
            <div >
              {this.state.posts.map((a)=>(
                <div key={a.id} className="post">
                  <div>
                    <div style={{display:"inline-flex"}}>
                      <img src={`http://localhost:8000/images/${a.user.photo}`}alt=""  height="25px" width="25px"/>
                      <h2>{ a.user.name}{ a.user.surname}</h2>
                    </div>
                     <div style={{height:"auto",width:"auto"}}>
                      {a.pic !== "" ? (<img src={`http://localhost:8000/images/${a.pic}`} alt="" className="pic-min" />):""}
                      <h1>{a.post}
                        {a.likes.find(a=>a.userId===this.state.data.id)?(
                        <i onClick={this.delLike.bind(this,a.id)} className="fa fa-thumbs-down " style={{float:"right"}}>
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
                  </div>
                  <h2 onClick={this.toggle_comment.bind(this,a.id)} style={{textDecoration:"underline"}}>Comments</h2>
                  <div className={"hide_"+a.id+" comment"}  style={{display:"none"}}>
                  {a.comments.map((comm)=>(
                    <div key={comm.id} className="m-2" style={{display: "grid"}}>
                      <img src={`http://localhost:8000/images/${comm.user.photo}`}alt=""  height="25px" width="25px" style={{borderRadius:"50%"}}/>
                      <div className="comment-item">
                      <b>{ comm.user.name}{ comm.user.surname}</b>
                      < p> {comm.comment }
                      </p>
                      <h6 style={{float:"inline-end"}}>
                      <i className="time">{(new Date(comm.time)).getDate()}-{((new Date(comm.time)).getMonth()+1)}-
                              { (new Date(comm.time)).getFullYear()} {(new Date(comm.time)).getHours() }: 
                              {(new Date(comm.time)).getMinutes()}</i>  
                      </h6>
                      </div>
                    </div>
                  ))}
                  </div>
                  
                  <div className="group" >
                    <input
                        onKeyDown={e=>this.sendWithEnter(e,a.id)}
                        type="text"
                        placeholder="Add comment"
                        className="comment-inp"
                        value={this.state.inp_comment[a.id]}
                        data-id="inp_comment"
                        onChange={this.changeComment.bind(this,a.id)}
                        />
                        <button className="Button" onClick={this.addComment.bind(this,a.id)}>Add</button>
                  </div>
                </div>
                ))}
            </div>
          </div>
          <div className="col-chat ">
              {
                this.state.openChat?<Chat send={this.send.bind(this)} data={this.state.chatFrData} mess={this.state.messages} close={this.close.bind(this)}></Chat>:null
              }
          </div> 
        </div>

 

        <div className="myDIV" style={{display: this.state.hide}}>
          <img  className="img" src={`http://localhost:8000/images/${this.state.data.photo}`} alt=""/>
          <div data-toggle="modal" data-target="#exampleModalCenter1" className="im-up">
              <img className="img_icon" src="https://www.clipartmax.com/png/small/281-2810310_png-file-cloud-upload-icon.png" alt="http://localhost:8000/images/unknown.png"/>
          </div>
          <h1>{this.state.data.name} {this.state.data.surname}</h1>
          <h6>{this.state.data.email}</h6>
          <Link className="Button" to="/profile/edit"> Manage your Account </Link>
          <button  className="Button" data-toggle="modal" data-target="#exampleModalCenter">
          Change Password 
           </button>
          <button  onClick={this.logout.bind(this)}  className="Button">
            Logout&ensp;
            <i className="fa fa-sign-out" aria-hidden="true"> </i>
            </button>
        </div>       
        
        <div className="modal fade" id="exampleModalCenter1" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLongTitle">Change Password</h5>
                      <button type="button" className="Button" data-dismiss="modal" aria-label="Close">
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
                      <button type="button" className="commentButton" data-dismiss="modal">Close</button>
                      <button onClick={this.addProfPic.bind(this)}  type="button" className="btn btn-primary">Add Propile pic</button>
                    </div>
                  </div>
                </div>
          </div>
        </div>
        <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="pass-content">
            <div className="pass-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Change Password</h5>
              <span  data-dismiss="modal" aria-label="Close"  aria-hidden="true">x</span>
            </div>
            <div className="pass-body">
            <input
              type="password"
              placeholder="Enter your old password"
              className="password-input"
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
              className="password-input"
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
              className="password-input"
              value={this.state.inp.new_confirm_password}
              data-id="new_confirm_password"
              onChange={this.change.bind(this)}
            />
              {this.state.errors.new_confirm_password ? (
              <div className="alert alert-danger m-2 w-100">{this.state.errors.new_confirm_password}</div>
            ) : null}
            </div>
            <div className="pass-footer">
              <button onClick={this.changePassword.bind(this)}  type="button" className="Button-pass">Save changes</button>
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
                    <button className="accept-button " onClick={this.accept.bind(this,a.id)}>Accept</button>
                    <div id="snackbar"></div>
                    <button className="delete-button" onClick={this.delete.bind(this,a.id)}>Delete</button>
                    <hr/>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </div>



      </div>
    );
  }
}

export default Profile;
