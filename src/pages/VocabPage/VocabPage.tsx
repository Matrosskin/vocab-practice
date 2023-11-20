import { useVocab } from '../../hooks/useVocab'
import { Layout, List } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Title from 'antd/es/typography/Title'
import { RecordListItem } from '../../components/RecordListItem/RecordListItem'
import { useRecords } from '../../hooks/useRecords'

export const VocabPage = () => {
  const vocab = useVocab()
  const records = useRecords(vocab?.id)

  return (
    <Layout>
      <Content>
        <Title level={3}>{vocab?.name}</Title>

        <List bordered dataSource={records} renderItem={(record, index) => <RecordListItem record={record} vocabId={vocab!.id} />} />
      </Content>
    </Layout>
  )
}
