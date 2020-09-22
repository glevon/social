import http from "../http-common"
import AuthHeader from './AuthHeader'
class UserService{
    getUserData(){
        return http.get('/profile',{headers:AuthHeader()})
    }
    edit(data){
        return http.post("/profile/edit",data,{headers:AuthHeader()})
    }
    changePassword(data){
        return http.post("/profile/changepas",data,{headers:AuthHeader()})
    }
    addProf(data){
        return http.post("/profile/addprof",data,{headers:AuthHeader()})
    }
    search(data){
        return http.post("/profile/search",{search:data},{headers:AuthHeader()})
    }
    addFriend(id){
        return http.post("/profile/addfriend",{id:id},{headers:AuthHeader()})

    }
    removeReq(id){
        return http.post("/profile/removeReq",{id:id},{headers:AuthHeader()})
    }
    note(data){
        return http.post("/profile/note",data,{headers:AuthHeader()})

    }
    accept(id){
        return http.post("/profile/accept",{id:id},{headers:AuthHeader()})
    }
    delete(id){
        return http.post("/profile/delete",{id:id},{headers:AuthHeader()})
    }
    addPost(data){
        return http.post("/profile/addpost",data,{headers:AuthHeader()})
    }
    getPost(data){
        return http.post("/profile/getpost",data,{headers:AuthHeader()})
    }
    getFriends(){
        return http.get("/profile/getFriends",{headers:AuthHeader()})
    }
    getMyRequests(){
        return http.get("/profile/getMyRequests",{headers:AuthHeader()})
    }
    addComment(data,id){
        return http.post("/profile/addcomment",{data:data,postId:id},{headers:AuthHeader()})
    }
    addLike(postId){
        return http.post("/profile/addlike",{postId:postId},{headers:AuthHeader()})
    }
    delLike(postId){
        return http.post("/profile/dellike",{postId:postId},{headers:AuthHeader()})
    }
    getMessages(id){
        return http.post("/profile/getMEssages",{id},{headers:AuthHeader()})
    }

}


export default new UserService()