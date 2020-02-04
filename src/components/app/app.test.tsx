import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
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

it('the README is epic', () => {
    fs.readFile( __dirname + '/../README.md', function (err, data) {
        if (err) {
            throw err;
        }
        console.log(data.toString());
        expect(data.toString()).toMatch(/epic/);
    });
});
