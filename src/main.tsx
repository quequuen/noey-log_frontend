import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Header from './layouts/Header.tsx'

createRoot(document.getElementById('root')!).render(
  <div className='flex-col justify-center item-center p-10'>
    <Header/>
    <App/>
  </div>
)
