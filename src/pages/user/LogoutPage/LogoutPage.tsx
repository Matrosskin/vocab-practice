import { getAuth, signOut } from 'firebase/auth'
import { useEffect } from 'react'
import { useAppSelector } from '../../../hooks/store'

export const LogoutPage = () => {
  const user = useAppSelector((state) => state.user.user)

  useEffect(() => {
    if (!user) return

    signOut(getAuth())
  }, [user])

  return <div>You are logged out.</div>
}
