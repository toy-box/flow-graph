import { Button } from 'antd'
import React, { useCallback } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { routes } from '../src/route'

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {routes.map((route, idx) => (
          <Route key={idx} path={route.path} element={<route.component />} />
        ))}
      </Routes>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
