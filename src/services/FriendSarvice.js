import http from "../http-common"
import AuthHeader from './AuthHeader'

class FriendService{
    getData(id){
        return http.get(`/friend/${id}/profile`,{headers:AuthHeader()})
    }

}


export default new FriendService()