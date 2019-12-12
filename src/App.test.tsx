import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Firebase from './components/Firebase/firebase';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('works with Firebase', () => {
  new Firebase();
})