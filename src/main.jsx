import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import { NotificationProvider } from './components/Notification/NotificationProvider'
import './index.css'
import './styles/globals.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </Provider>
  </StrictMode>,
)