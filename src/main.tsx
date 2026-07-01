import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Header from './layouts/Header.tsx'
import BackgroundStars from './components/BackgroundStars.tsx' 
import './App.css'

createRoot(document.getElementById('root')!).render(
  <div className='relative flex flex-col items-stretch p-10 gap-8 min-h-screen bg-black overflow-x-hidden'>
    
    <BackgroundStars /> 

    <div className="z-10 w-full flex flex-col items-center gap-8 mx-auto">
      <Header/>
      <App/>
    </div>
  </div>
)
