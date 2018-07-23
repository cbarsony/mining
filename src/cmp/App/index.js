import React, {Component} from 'react'
import makeBem from 'bem-cx'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'

import './App.css'
import {PlannerPage} from './PlannerPage'
import {UploaderPage} from './UploaderPage'

const cn = makeBem('App')

export class App extends Component {
  render() {
    return (
      <Router>
        <div className={cn}>

          <div className={cn.el('Header')}>
            <div className={cn.el('Header').el('Heading')}>Minealytics</div>
            <Link to="/planner">Planner</Link>
            <Link to="/uploader">Uploader</Link>
          </div>

          <div className={cn.el('Content')}>
            <Route
              exact
              path="/"
              component={PlannerPage}
            />
            <Route
              path="/planner"
              component={PlannerPage}
            />
            <Route
              path="/uploader"
              component={UploaderPage}
            />
          </div>

        </div>

      </Router>
    )
  }
}
