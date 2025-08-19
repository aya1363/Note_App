import * as authService from './user.service.js'
import { Router } from 'express'
const router = Router()

router.post('/signup', authService.signup)
router.post('/login', authService.login)
router.patch('/:id', authService.updateUser)
router.delete('/:id', authService.deleteUser)
router.get('/', authService.allUsers)



export default router