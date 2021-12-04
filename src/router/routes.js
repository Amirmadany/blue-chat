// components - pages - views
const Home = () => import('../pages/Home.vue')
const EditProfile = () => import('../pages/EditProfile.vue')
const Users = () => import('@/pages/Users.vue')
const UserInfo = () => import('@/pages/UserInfo.vue')
const Messages = () => import('@/pages/messages/Wrapper.vue')

const Auth = () => import('../pages/auth/Auth.vue')
const Login = () => import('../pages/auth/Login.vue')
const Register = () => import('../pages/auth/Register.vue')

// define routes
const routes = [
    {
        path: '/',
        component: Home,
        name: 'home',
        meta: {
            auth: true
        },
        children: [
            {
                path: 'setting/profile',
                component: EditProfile,
                name: 'edit-profile'
            },
            {
                path: 'users',
                component: Users,
                name: 'users'
            },
            {
                path: 'user-info/:email',
                component: UserInfo,
                name: 'user-info'
            },
            {
                path: '',
                component: Messages,
                name: 'messages'
            },
            {
                path: '/chat/:email',
                component: Messages,
                name: 'chat'
            }
        ]
    },
    {
        path: '/auth',
        component: Auth,
        name: 'auth',
        meta: {
            guest: true
        },
        children: [
            {
                path: 'login',
                component: Login,
                name: 'login'
            },
            {
                path: 'register',
                component: Register,
                name: 'register'
            }
        ]
    }
]

export default routes