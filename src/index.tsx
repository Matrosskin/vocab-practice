import 'antd/dist/reset.css'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { routerConfig } from './misc/routerConfig'
import { FirebaseReadyProvider } from './misc/FirebaseReadyProvider'
import { Provider } from 'react-redux'
import { store } from './misc/store'

const router = createBrowserRouter(routerConfig)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <Provider store={store}>
    <FirebaseReadyProvider>
      <RouterProvider router={router} />
    </FirebaseReadyProvider>
  </Provider>
)
