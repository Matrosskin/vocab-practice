import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, Button, Dropdown, MenuProps } from 'antd'
import { useAppSelector } from '../../hooks/store'
import { useMemo } from 'react'
import { insertAIf } from '../../utils/insertAIf'
import { ItemType } from 'antd/es/menu/hooks/useItems'
import { Link, useLocation } from 'react-router-dom'
import { useVocabs } from '../../hooks/useVocabs'
import { useVocab } from '../../hooks/useVocab'

export const HeaderDropdownMenu = () => {
  const user = useAppSelector((state) => state.user.user)
  const location = useLocation()
  const vocabs = useVocabs()
  const { id: openedVocabId } = useVocab() || {}

  const menuItems = useMemo((): MenuProps['items'] => {
    return [
      ...insertAIf<ItemType>(
        Boolean(user && vocabs.length && openedVocabId),
        {
          key: 'addRecord',
          label: <Link to={`/vocab/${openedVocabId}/new-word`}>Add word</Link>,
        },
        {
          type: 'divider',
        }
      ),
      ...insertAIf<ItemType>(
        Boolean(user && vocabs.length === 1 && !new RegExp('^/vocab.*$').test(location.pathname)),
        {
          key: 'home',
          label: <Link to={`/vocab/${openedVocabId}`}>Vocabulary</Link>,
        },
        {
          type: 'divider',
        }
      ),
      ...insertAIf<ItemType>(
        Boolean(user && vocabs.length && openedVocabId),
        {
          key: 'practices',
          label: 'Practices',
          children: [
            {
              key: 'randomCards',
              label: <Link to={`/practicing/random-card/${openedVocabId}`}>Open random card</Link>,
            },
            {
              key: 'buildWord',
              label: <Link to={`/practicing/build-word/${openedVocabId}`}>Build word</Link>,
            },
          ],
        },
        {
          type: 'divider',
        }
      ),
      ...insertAIf<ItemType>(
        Boolean(user && vocabs.length > 1),
        {
          key: 'vocabs',
          type: 'group',
          label: 'Your vocabs:',
          children: vocabs.map(({ id, name, recordsCount }) => ({
            key: `vocab-item-${id}`,
            label: (
              <Link to={`/vocab/${id}`}>
                {name} <Badge count={recordsCount || 0} showZero color='DodgerBlue' size='small' />
              </Link>
            ),
          })),
        },
        {
          type: 'divider',
        }
      ),
      ...insertAIf<ItemType>(
        Boolean(user),
        {
          key: 'goToSettings',
          label: <Link to={`/settings`}>Settings</Link>,
        },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          label: <Link to={`/logout`}>Logout</Link>,
        }
      ),
      ...insertAIf<ItemType>('/login' === location.pathname, {
        key: 'registration',
        label: <Link to={`/registration`}>Registration</Link>,
      }),
      ...insertAIf<ItemType>(['/registration', '/logout'].includes(location.pathname), {
        key: 'login',
        label: <Link to={`/login`}>Login</Link>,
      }),
    ]
  }, [location.pathname, openedVocabId, user, vocabs])

  return (
    <Dropdown menu={{ items: menuItems, selectedKeys: [`vocab-item-${openedVocabId}`] }} placement='bottomRight' trigger={['click']}>
      <Button icon={<FontAwesomeIcon icon={faBars} />} />
    </Dropdown>
  )
}
