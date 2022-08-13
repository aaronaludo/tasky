import React from 'react';
import { Route, Redirect, RouteProps} from 'react-router-dom';
import cookies from 'js-cookie';

interface props extends RouteProps{
    component: React.ComponentType;
}

const GuestRoute = ({component: Component, ...props} : props) => {
    return <Route path={props.path} exact render={() => {
        const token = cookies.get(`tasky_token`);

        if(token !== undefined) {
            return <Component {...props}/>
        }

        return <Redirect to={'/login'} />;
    }} />;
}

export default GuestRoute;