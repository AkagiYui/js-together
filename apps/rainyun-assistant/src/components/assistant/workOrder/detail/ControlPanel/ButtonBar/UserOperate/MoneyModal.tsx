import { Button, Modal } from "@douyinfe/semi-ui"
import { Table } from "@douyinfe/semi-ui"
import { IconArrowUp, IconRefresh } from "@douyinfe/semi-icons"
import { Empty } from "@douyinfe/semi-ui"
import { IllustrationNoResult, IllustrationNoResultDark } from "@douyinfe/semi-illustrations"
import { useUserMoneyLogList } from "@/hooks"
import { useEffect, useState } from "react"
import { Group } from "@/components/Group"

const { Column } = Table
interface Props {
  show: boolean
  onCloseClick?: () => void
  userId: number
}

export const MoneyModal = ({ show, onCloseClick, userId }: Props) => {
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { data, refetch } = useUserMoneyLogList({ userId: userId, pageIndex, pageSize })

  useEffect(() => {
    if (show) {
      refetch()
    }
  }, [show, pageIndex])

  const renderTime = (text, record: UserMoneyLog, index) => {
    return <div>{new Date(text * 1000).toLocaleString()}</div>
  }

  const renderMoneyNow = (text, record: UserMoneyLog, index) => {
    const upOrDown = record.moneyChanged === 0 ? "" : record.moneyNow - record.moneyBefore > 0 ? "+" : "-"

    const Icon = () => {
      if (upOrDown === "+") {
        return <IconArrowUp size="small" style={{ color: "var(--semi-color-success)", marginLeft: "2px" }} />
      }
      if (upOrDown === "-") {
        return (
          <IconArrowUp size="small" style={{ color: "var(--semi-color-danger)", marginLeft: "2px" }} rotate={180} />
        )
      }
      return ""
    }

    return (
      <div>
        {text}
        <Icon />
      </div>
    )
  }

  return (
    <>
      <Modal
        className="semi-light-scrollbar"
        title="余额日志"
        visible={show}
        onCancel={() => {
          onCloseClick && onCloseClick()
        }}
        centered
        width={800}
        // height={670}
        bodyStyle={{}}
        footerFill
        footer={
          <Group justify="end">
            <Button icon={<IconRefresh />}>刷新</Button>
          </Group>
        }
      >
        <Table
          dataSource={data?.records}
          pagination={{
            total: data?.count,
            pageSize: pageSize,
            currentPage: pageIndex,
            onPageChange: (page) => {
              setPageIndex(page)
            },
          }}
          sticky
          size={"small"}
          scroll={{ y: 450 }}
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
          <Column title="ID" dataIndex="id" key="id" width={110} />
          <Column
            title="时间"
            dataIndex="time"
            key="time"
            render={renderTime}
            width={160}
            className="whitespace-nowrap"
          />
          <Column title="前余额" dataIndex="moneyBefore" align="right" key="moneyBefore" width={100} />
          <Column
            title="后余额"
            dataIndex="moneyNow"
            align="right"
            key="moneyNow"
            render={renderMoneyNow}
            width={100}
          />
          <Column title="变化金额" dataIndex="moneyChanged" align="right" key="moneyChanged" width={100} />
          <Column title="调用函数" dataIndex="callerFunc" key="callerFunc" width={1000} />
        </Table>
      </Modal>
    </>
  )
}
