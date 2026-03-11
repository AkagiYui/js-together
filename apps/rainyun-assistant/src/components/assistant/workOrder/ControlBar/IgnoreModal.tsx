import { Group } from "@/components/Group"
import { Button, Modal, Space } from "@douyinfe/semi-ui"
import { Table } from "@douyinfe/semi-ui"
import { IconEyeClosed, IconEyeOpened } from "@douyinfe/semi-icons"
import { ignoreWorkOrderMapAtom } from "@/stores"
import { useAtom } from "jotai"
import { UserLevelIcon } from "../../UserLevelIcon"
import { StatusTag } from "../StatusTag"
import { TypeTag } from "../TypeTag"
import { Empty } from "@douyinfe/semi-ui"
import { IllustrationNoResult, IllustrationNoResultDark } from "@douyinfe/semi-illustrations"

const { Column } = Table

export const IgnoreModal = ({ show, onCloseClick }: { show: boolean; onCloseClick?: () => void }) => {
  const [ignoreWorkOrderMap, setIgnoreWorkOrderMap] = useAtom(ignoreWorkOrderMapAtom)

  const footerStyle = `.semi-modal-footer .semi-button {
    margin-left: 0;
    margin-right: 0;
  }`

  const data = Object.values(ignoreWorkOrderMap)

  const renderTitle = (text, record: WorkOrder, index) => {
    return (
      <Space>
        <UserLevelIcon level={record.user.level} />
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
        <Button
          icon={<IconEyeOpened />}
          onClick={() => {
            setIgnoreWorkOrderMap((prev) => {
              const next = { ...prev }
              delete next[record.id]
              return next
            })
          }}
        />
      </>
    )
  }

  return (
    <>
      <Modal
        className="semi-light-scrollbar"
        title="忽略工单列表"
        visible={show}
        onCancel={() => {
          onCloseClick && onCloseClick()
        }}
        centered
        closable={false}
        width={800}
        bodyStyle={{}}
        footerFill
        footer={
          <Group justify="between">
            <style>{footerStyle}</style>
            <Button
              icon={<IconEyeOpened />}
              type="tertiary"
              onClick={() => {
                setIgnoreWorkOrderMap({})
              }}
            >
              全部恢复
            </Button>
            <Button
              icon={<IconEyeClosed />}
              type="primary"
              onClick={() => {
                onCloseClick && onCloseClick()
              }}
            >
              关闭窗口
            </Button>
          </Group>
        }
      >
        <Table
          dataSource={data}
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
