import Login from "./components/pages/auth/Login";
import Tasky from './components/pages/tasky';

const routes = [
    {
        'path': '/login',
        'component': Login,
        'type': 'guest',
    },
    {
        'path': '/tasky',
        'component': Tasky,
        'type': 'guest',
    },
];

export default routes;
