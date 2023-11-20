import { useVocab } from '../../hooks/useVocab'
import { Layout, List } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import { IRecord } from '../../interfaces/IRecord'
import { RecordListItem } from '../../components/RecordListItem/RecordListItem'

export const VocabPage = () => {
  const vocab = useVocab()

  const records: IRecord[] = [
    {
      word: 'asd',
    },
    {
      word: 'fgh rthdh',
      translation: 'dsgfosekm',
      description: 'dfnsdjnvdf psfowwmsds ds lkdoiw sdsdio wefodfdngd dfskvmsdcnds',
    },
    {
      word: '123',
      translation: 'sdvsfioisodifj',
    },
  ]

  return (
    <Layout>
      <Content>
        <Title level={3}>{vocab?.name}</Title>

        <List bordered dataSource={records} renderItem={(record, index) => <RecordListItem record={record} />} />
      </Content>
    </Layout>
  )
}
