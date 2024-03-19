import express from "express";
import users from '../controllers/usersController.js';
import authController from "../controllers/authController.js";

const router = express.Router();
const { getUsers, getUser, updateUser, postUser, deleteUser, updateMe, deleteMe, getMe } = users;
const { signup, login, forgotPassword, protect, resetPassword, updatePassword, restrictTo } = authController;

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);

router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);
router.get('/me', protect, getMe, getUser);

router.use(restrictTo('admin'));

router
  .route('/')
  .get(getUsers)
  .post(postUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

export default router;