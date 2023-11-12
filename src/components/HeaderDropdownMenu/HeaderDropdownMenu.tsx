import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Dropdown, MenuProps } from "antd"
import { useAppSelector } from "../../hooks/store"
import { useEffect, useMemo, useState } from "react"
import { insertAIf } from "../../utils/insertAIf"
import { ItemType } from "antd/es/menu/hooks/useItems"
import { Link, useLocation } from "react-router-dom"
import { getDatabase, onChildAdded, onChildChanged, onChildRemoved, ref } from "firebase/database"

interface IVocab {
  id: string,
  name: string,
}

export const HeaderDropdownMenu = () => {
  const user = useAppSelector((state) => state.user.user)
  const location = useLocation()
  const [vocabs, setVocabs] = useState<IVocab[]>([])

  // TODO: Extract fetching of vocabs into separate hook.
  useEffect(() => {
    if (!user?.uid) return

    let temporaryVocabs: IVocab[] = []
    const db = getDatabase()
    const vocabListRef = ref(db, `v-p-app-v1/users/${user?.uid}/vocabs`)
    const stopOnChildAdded = onChildAdded(vocabListRef, (snapshot) => {
      temporaryVocabs = [
        ...temporaryVocabs,
        {
          id: snapshot.key!,
          name: snapshot.val().name as string
        }
      ]
      setVocabs(temporaryVocabs)
    })
    const stopOnChildChanged = onChildChanged(vocabListRef, (snapshot) => {
      temporaryVocabs = temporaryVocabs.map((vocab) => (vocab.id === snapshot.key ? {
        id: snapshot.key!,
        name: snapshot.val().name as string
      } : vocab))
      setVocabs(temporaryVocabs)
    })
    const stopOnChildRemoved = onChildRemoved(vocabListRef, (snapshot) => {
      temporaryVocabs = temporaryVocabs.filter(({id}) => id === snapshot.key)
      setVocabs(temporaryVocabs)
    })

    return () => {
      stopOnChildAdded()
      stopOnChildChanged()
      stopOnChildRemoved()

      setVocabs([])
    }
  }, [user?.uid])

  // TODO: Managing of vocabs should be moved into "Settings" page, so there will be a list with create, edit and delete buttons.
  const menuItems = useMemo((): MenuProps['items'] => {
    return [
      ...insertAIf<ItemType>(
        Boolean(user && vocabs.length),
        {
          key: 'vocabs',
          type: 'group',
          label: 'Your vocabs:',
          children: vocabs.map(({id, name}) => ({
            key: `vocab-item-${id}`,
            label: name
          }))
        }
      ),
      ...insertAIf<ItemType>(
        Boolean(user),
        {
          key: 'createVocab',
          label: (
            // TODO: It seems it would be better to move this item into settings page or so.
            <Link to={`/create-vocab`}>Create vocab</Link>
          ),
        },
        {
          type: 'divider'
        },
        {
          key: 'logout',
          label: (
            <Link to={`/logout`}>Logout</Link>
          ),
        }
      ),
      ...insertAIf<ItemType>(
        '/login' === location.pathname,
        {
          key: 'registration',
          label: (
            <Link to={`/registration`}>Registration</Link>
          ),
        }
      ),
      ...insertAIf<ItemType>(
        ['/registration', '/logout'].includes(location.pathname),
        {
          key: 'login',
          label: (
            <Link to={`/login`}>Login</Link>
          ),
        }
      )
    ]
  }, [location.pathname, user, vocabs])

  return <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
    <Button icon={<FontAwesomeIcon icon={faBars} />} />
  </Dropdown>
}
