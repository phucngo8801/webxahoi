import express from "express"
import { deleteUser, getUser, updatedUser, followUser , UnFollowUser} from "../Controllers/UserController.js";

const router = express.Router();

router.get('/:id',getUser)
router.put('/:id',updatedUser)
router.delete('/:id', deleteUser)
router.put('/:id/follow', followUser)
router.put('/:id/unfollow', UnFollowUser)


export default router