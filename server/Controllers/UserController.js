import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'

//get a user
export const getUser = async(req, res)=> {
    const id = req.params.id;
    try{
        const user = await UserModel.findById(id);
        if(user){
            const {password, ...otherDetails} = user._doc

            res.status(200).json(otherDetails)
        }
        else{
            res.status(404).json("no such user exists")
        }
    } catch(error){
    res.status(500).json(error)

    }
};
//update a user 
export  const  updatedUser = async(req, res) => {
    const id = req.params.id
    const {currentUserId, currentUserAdminStatus, password} = req.body;

    if(id === currentUserId || currentUserAdminStatus){
        try {

            if(password)
            {
             const salt = await bcrypt.genSalt(10);
             req.body.password = await bcrypt.hash(password, salt)
            }

            const user = await UserModel.findByIdAndUpdate(id, req.body, {new: true,
            });
            res.status(200).json(user);
        }
        catch (error){
            res.status(500).json(error);

        }
   
    }
   else 
   {
    res
    .status(403)
    .json("Access Denied! You can update only your own Account.");
}

};
//Delete user

export const deleteUser = async (req, res) =>{
    const id  = req.params.id
    const {currentUserId, currentUserAdminStatus} =req.body
    if(currentUserId === id || currentUserAdminStatus)
    {
        try{
            await UserModel.findByIdAndDelete(id)
            res.status(200).json("User deleted successfully")
    }  catch (error){
        res.status(500).json(error);

    }
}
    else{
        res.status(403).json("Access Denied! you can only delete your own profile");
    }
}

// Follow a user 
export const followUser = async (req, res) =>{
    const id = req.params.id
    const {currentUserId} = req.body
    if(currentUserId === id)
    {
        res.status(403).json("Action forbibden")
    }
    else {
        try{
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)
            if(!followUser.followers.includes(currentUserId))
            {
                await followUser.updateOne({$push: {followers:currentUserId}})
                await followingUser.updateOne({$push: {following:id }})
                res.status(200).json("User followed")
            }
            else{
                res.status(403).json("user is Alreadyu")
            }
        }
        catch(error){
            res.status(500).json(error);

        }
    }
}

// UnFollow a user 
export const UnFollowUser = async (req, res) =>{
    const id = req.params.id
    const {currentUserId} = req.body
    if(currentUserId === id)
    {
        res.status(403).json("Action forbibden")
    }
    else {
        try{
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)
            if(!followUser.followers.includes(currentUserId))
            {
                await followUser.updateOne({$pull: {followers:currentUserId}})
                await followingUser.updateOne({$pull: {following:id }})
                res.status(200).json("User Unfollowed")
            }
            else{
                res.status(403).json("user is not followed by you")
            }
        }
        catch(error){
            res.status(500).json(error);

        }
    }
}


