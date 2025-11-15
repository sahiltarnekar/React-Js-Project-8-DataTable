import React, { Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/css/styles.css'
import Routing from './Routing.jsx'
import Loading from './Component/Loading.jsx'

const App = () => {
  useEffect(() => {
    document.title = "DataTable"
  }, [])

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {Routing.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App;
