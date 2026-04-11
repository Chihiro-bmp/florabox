import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TransitionContext = createContext(null)

export function TransitionProvider({ children }) {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const timerRef = useRef(null)

  const transitionTo = useCallback((path) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(true)
    timerRef.current = setTimeout(() => {
      navigate(path)
      timerRef.current = setTimeout(() => {
        setVisible(false)
      }, 60)
    }, 300)
  }, [navigate])

  return (
    <TransitionContext.Provider value={{ visible, transitionTo }}>
      {children}
    </TransitionContext.Provider>
  )
}

export const useTransition = () => useContext(TransitionContext)
