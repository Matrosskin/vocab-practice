import { Button } from 'antd'
import { GoogleAuthProvider, getAdditionalUserInfo, getAuth, signInWithPopup } from 'firebase/auth'
import { GoogleIcon } from '../GoogleIcon/GoogleIcon'
import { useBusy } from '../../hooks/useBusy'
import { getDatabase, push, ref, set } from 'firebase/database'

export const GoogleButton = () => {
  const [, setIsBusy] = useBusy()

  const onLoginWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    const auth = getAuth()
    signInWithPopup(auth, provider)
      .then((result) => {
        const isNewUser = getAdditionalUserInfo(result)?.isNewUser
        if (!isNewUser) {
          return
        }

        setIsBusy(true)

        const uid = result.user.uid
        const db = getDatabase()
        const vocabListRef = ref(db, `v-p-app-v1/users/${uid}/vocabs`)
        const vocabRef = push(vocabListRef)
        set(vocabRef, {
          name: 'Your vocabulary',
        }).finally(() => {
          setIsBusy(false)
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <Button htmlType='button' onClick={onLoginWithGoogle}>
      <GoogleIcon />
    </Button>
  )
}
