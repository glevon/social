import UserService from "../services/UserService"
import React, { Component } from "react";
import io from "socket.io-client"

module.exports = {
    logout(){
        window.localStorage.removeItem('user');
        this.props.history.push("/signin","Please Log in")
      },
    toggle(){
    if (this.state.hide==="none") {
        this.state.hide="block"
    } else {
        this.state.hide="none"
    }
    this.setState({})

    },
      change(e){
          this.state.inp[e.target.getAttribute("data-id")] = e.target.value;
          this.setState({});
      },
      changePost(e){
        if (e.target.getAttribute("data-id")==="pic") {
          this.state.postInp[e.target.getAttribute("data-id")] = e.target.files[0];
        } else {
          this.state.postInp[e.target.getAttribute("data-id")] = e.target.value;
        }
        this.setState({});
      },
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
      },
      changeComment(id,e){
        this.state[e.target.getAttribute("data-id")].id= e.target.value;
        this.setState({});
      },
      changePhoto(e){
        this.state[e.target.getAttribute("data-id")] = e.target.files[0];
        this.setState({});
    },
    addProfPic(){
      let formData= new FormData()
      formData.append("profPic",this.state.profPic)
      UserService.addProf(formData).then((r)=>{
        this.state.data.photo=r.data.filename
        this.state.hide="none"
        this.setState({})
    
      })
    },
    addPost(){
      let formData= new FormData()
      formData.append("post",this.state.postInp.post)
      formData.append("pic",this.state.postInp.pic)
      console.log("AAAAAAAAAAAA");
      UserService.addPost(formData).then((r)=>{
        console.log("posted");
      })
    },
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
      },
      addFriend(id){
        UserService.addFriend(id)
        .then((r)=>{
          this.state.users.find(a=>a.id===id).status="requested"
          this.setState({})
        })
      },
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
      },
    
    
      note(){
        UserService.note()
        .then((r)=>{
          this.state.requests=r.data
          this.setState({})
        })
      },
      accept(id){
        UserService.accept(id)
        .then((r)=>{
          this.note.bind(this)
          this.setState({})
        })
      },
    
      delete(id){
        UserService.delete(id)
        .then((r)=>{
          this.note.bind(this)
          this.setState({})
        })
      },
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
        },
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
    
      },
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
    
      },
      close(){
        this.state.openChat = false ;
        this.setState({})
        this.socket.disconnect()
    
    
      },
      commentname(comm){
        this.state.allUsers.map((u)=>{
          if (u.id===comm) {
            return(<h4>u.name +" " +u.surname</h4>);
          }
    
        })    
      },
      send(message,userId){
        this.socket.emit("send_message",
        {
          message,
          userId,
          myId:this.state.data.id,
        }
        )
      },
 }