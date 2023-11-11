import { connectAuthEmulator, getAuth, onAuthStateChanged } from 'firebase/auth'
import { connectDatabaseEmulator, getDatabase } from 'firebase/database'
import { PropsWithChildren, useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './firebaseConfig'
import { useAppDispatch } from '../hooks/store'
import { setDetermined, setUser } from '../slices/userSlice'

export function FirebaseReadyProvider({ children }: PropsWithChildren) {
  const [isFirebaseReady, setFirebaseReadyState] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    initializeApp(firebaseConfig)

    function whenFBReady() {
      setFirebaseReadyState(true)

      const auth = getAuth()
      onAuthStateChanged(auth, (user) => {
        dispatch(setDetermined())
        dispatch(setUser(user ? {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        } : null))
      })
    }

    if (process.env.NODE_ENV !== 'production') {
      fetch(`http://${window.location.hostname}:4400/emulators`)
      .then((res) => res.json())
      .then((data) => {
        const auth = getAuth()
        connectAuthEmulator(auth, `http://${window.location.hostname}:${data.auth.port}`, { disableWarnings: true })

        const db = getDatabase()
        connectDatabaseEmulator(db, window.location.hostname, data.database.port)

        whenFBReady()
      })
    } else {
      whenFBReady()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isFirebaseReady ? <>{children}</> : null
}
