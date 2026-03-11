import { Button, Modal, Space } from "@douyinfe/semi-ui"
import { Table } from "@douyinfe/semi-ui"
import { IconCustomerSupport } from "@douyinfe/semi-icons"
import { StatusTag } from "@/components/assistant/workOrder/StatusTag"
import { TypeTag } from "@/components/assistant/workOrder/TypeTag"
import { Empty } from "@douyinfe/semi-ui"
import { IllustrationNoResult, IllustrationNoResultDark } from "@douyinfe/semi-illustrations"
import { useWorkOrderList } from "@/hooks"
import { Link } from "@tanstack/react-router"

const { Column } = Table
interface Props {
  show: boolean
  onCloseClick?: () => void
  userId: number
}

export const WorkOrderModal = ({ show, onCloseClick, userId }: Props) => {
  const { data } = useWorkOrderList({ userId: userId, enabled: show })

  const footerStyle = `.semi-modal-footer {
    margin-left: 0;
    margin-right: 0;
    margin-top: 0;
  }`

  const renderTitle = (text, record: WorkOrder, index) => {
    return (
      <Space>
        <div className="min-h-[3rem] flex items-center">
          <span className="line-clamp-2 leading-6">{text}</span>
        </div>
      </Space>
    )
  }

  const renderStatus = (text, record: WorkOrder, index) => {
    return <StatusTag status={text} shape="circle" />
  }

  const renderTime = (text, record: WorkOrder, index) => {
    return <div>{new Date(text * 1000).toLocaleString()}</div>
  }

  const renderType = (text, record: WorkOrder, index) => {
    return <TypeTag type={text} />
  }

  const renderOperate = (text, record: WorkOrder, index) => {
    return (
      <>
        <Link
          href={`/assistant/workorder/${record.id}`}
          preload="intent"
          onClick={() => {
            onCloseClick?.()
          }}
        >
          <Button icon={<IconCustomerSupport />} />
        </Link>
      </>
    )
  }

  return (
    <>
      <Modal
        className="semi-light-scrollbar"
        title="用户工单列表"
        visible={show}
        onCancel={() => {
          onCloseClick?.();
        }}
        centered
        width={800}
        bodyStyle={{}}
        footerFill
        footer={<style>{footerStyle}</style>}
      >
        <Table
          dataSource={data?.records}
          pagination={false}
          sticky
          size={"small"}
          scroll={{ y: 500 }}
          className="h-133"
          empty={
            <Empty
              image={<IllustrationNoResult style={{ width: 150, height: 150 }} />}
              darkModeImage={<IllustrationNoResultDark style={{ width: 150, height: 150 }} />}
              description={"暂无记录"}
              style={{
                padding: 30,
              }}
            />
          }
        >
          <Column title="标题" dataIndex="title" key="title" render={renderTitle} width={100} />
          <Column title="工单ID" dataIndex="id" key="id" width={55} />
          <Column title="类型" dataIndex="type" key="type" render={renderType} width={60} />
          <Column title="状态" dataIndex="status" key="status" render={renderStatus} width={60} />
          <Column
            title="提交时间"
            dataIndex="time"
            key="time"
            render={renderTime}
            width={100}
            className="whitespace-nowrap"
          />
          <Column dataIndex="operate" key="operate" render={renderOperate} width={40} />
        </Table>
      </Modal>
    </>
  )
}
