import { Button } from 'antd'
import { getAuth, signOut } from 'firebase/auth'

export const VocabPage = () => {
  const onDoLogout = () => {
    signOut(getAuth())
  }
  return <div>
    Vocab Page

    <div>
      <Button onClick={onDoLogout}>Logout</Button>
    </div>
  </div>
}
