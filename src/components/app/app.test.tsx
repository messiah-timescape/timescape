import React from 'react';
import ReactDOM from 'react-dom';
import App from './';
import Firebase from '../Firebase/firebase';

import fs from 'fs';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('works with Firebase', () => {
  new Firebase();
})