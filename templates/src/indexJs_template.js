const import_default = `import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/app';
`;

const import_router = `import { Router, Route } from 'react-router-dom';
import createHistory from "history/createBrowserHistory";
`;

const import_redux = `import { Provider } from 'react-redux';
import {createStore} from "redux";
import redusers from './redusers'
`;



const main_default = `ReactDOM.render(
    <App/>,
    document.getElementById("index")
    );
`;

const main_redux = `const store = createStore(redusers);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
`

const main_router = `const history = createHistory();
ReactDOM.render(
  <Router history={history}>
      <Route exact path="/" component={App} />
  </Router>,
  document.getElementById('root')
);
`
const main_router_redux = `const store = createStore(redusers);
const history = createHistory();
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route exact path="/" component={App} />
    </Router>
  </Provider>,
  document.getElementById('root')
)
`

const main = {
    main_default,
    main_router_redux,
    main_redux,
    main_router
}

const imports = {
    import_default,
    import_redux,
    import_router
}

module.exports = {
    main,
    imports
}
