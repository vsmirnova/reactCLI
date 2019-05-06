import React from 'react';
import {Route, Switch} from "react-router-dom";
import Test from "../components/Test"


export function MainRoute(props) {

    return (
        <Switch>
            <Route path="*" component={Test} />
        </Switch>
    );
}
