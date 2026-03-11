import { Group } from "@/components/Group"
import { Button, Divider, SideSheet } from "@douyinfe/semi-ui"
import { UserInfo } from "./UserInfo"
import { UserRemark } from "./UserRemark"
import { showUserRemarkAtom } from "@/stores"
import { useAtomValue } from "jotai"
import { useState } from "react"
import { WorkOrderModal } from "./WorkOrderModal"
import { DetailInfoModal } from "./DetailInfoModal"
import { MoneyModal } from "./MoneyModal"
import { useUserCertifyInfo } from "@/hooks"
import { CertifyCard } from "./CertifyCard"
import { RewardMutation } from "./RewardMutation"
import { ProductTypeIcon } from "@/components/assistant/ProductTypeIcon"
import {
  IconActivity,
  IconCreditCard,
  IconCustomerSupport,
  IconGift,
  IconIdCard,
  IconPriceTag,
  IconServer,
  IconShoppingBag,
  IconUnlink,
  IconUnlock,
  IconUser,
} from "@douyinfe/semi-icons"
import { MoneyMutation } from "./MoneyMutation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faYenSign } from "@fortawesome/free-solid-svg-icons"
import { ButtonProps } from "@douyinfe/semi-ui/lib/es/button"
import { VipMutation } from "./VipMutation"

const ButtonGrid = ({ data }: { data: ButtonProps[] }) => {
  return (
    <div
      className="grid gap-2 w-full"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
        gridAutoRows: "1fr",
      }}
    >
      {data.map((button, index) => (
        <Button
          {...button}
          key={index}
          icon={button.icon}
          className="flex items-center justify-center gap-2"
          onClick={button.onClick}
        >
          {button.children}
        </Button>
      ))}
    </div>
  )
}

export const UserOperate = ({
  data,
  show,
  onClose,
}: {
  data: WorkOrderDetail["user"]
  show: boolean
  onClose: () => void
}) => {
  const getContainer = () => {
    return document.querySelector<HTMLElement>(".user-sidesheet-container")!
  }

  const showUserRemark = useAtomValue(showUserRemarkAtom)
  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false)
  const [showDetailInfoModal, setShowDetailInfoModal] = useState(false)
  const [showMoneyModal, setShowMoneyModal] = useState(false)
  const {
    data: certifyInfo,
    refetch: fetchCertifyInfo,
    isFetching: isFetchingCertifyInfo,
    reset: resetCertifyInfo,
  } = useUserCertifyInfo({ userId: data.id })

  const infoButtonList = [
    { icon: <IconCustomerSupport />, children: "历史工单", onClick: () => setShowWorkOrderModal(true) },
    { icon: <IconIdCard />, children: "实名认证", onClick: () => fetchCertifyInfo(), disabled: isFetchingCertifyInfo },
    { icon: <IconUser />, children: "详细信息", onClick: () => setShowDetailInfoModal(true) },
    { icon: <IconGift />, children: "积分日志" },
    {
      icon: <FontAwesomeIcon icon={faYenSign} className="w-16px" />,
      children: "余额日志",
      onClick: () => setShowMoneyModal(true),
    },
    { icon: <IconShoppingBag />, children: "消费日志" },
    { icon: <IconActivity />, children: "用户日志" },
    { icon: <IconServer />, children: "产品日志" },
    { icon: <IconPriceTag />, children: "优惠券" },
    { icon: <IconCreditCard />, children: "充值记录" },
  ]

  const productButtonList = [
    { icon: <ProductTypeIcon type="rvh" />, children: "虚拟主机" },
    { icon: <ProductTypeIcon type="rcs" />, children: "云服务器" },
    { icon: <ProductTypeIcon type="rgs" />, children: "游戏云" },
    { icon: <ProductTypeIcon type="rcdn" />, children: "雨盾CDN" },
    { icon: <ProductTypeIcon type="ros" />, children: "对象存储" },
    { icon: <ProductTypeIcon type="rbm" />, children: "裸金属" },
  ]

  const operationButtonList = [
    { icon: <IconUnlock />, children: "解绑认证" },
    { icon: <IconIdCard />, children: "添加实名" },
    { icon: <IconUnlink />, children: "解绑上级" },
  ]

  return (
    <>
      <WorkOrderModal userId={data.id} show={showWorkOrderModal} onCloseClick={() => setShowWorkOrderModal(false)} />
      <DetailInfoModal userId={data.id} show={showDetailInfoModal} onCloseClick={() => setShowDetailInfoModal(false)} />
      <MoneyModal userId={data.id} show={showMoneyModal} onCloseClick={() => setShowMoneyModal(false)} />
      <SideSheet
        title={`用户操作面板`}
        visible={show}
        onCancel={onClose}
        getPopupContainer={getContainer}
        mask={false}
        closeOnEsc={true}
        keepDOM
        width={500}
      >
        <Group vertical className="w-full overflow-hidden">
          <UserInfo data={data} />
          {showUserRemark && <UserRemark userId={data.id} />}
          {certifyInfo !== undefined && <CertifyCard info={certifyInfo} onClose={resetCertifyInfo} />}
          <Group wrap>
            <Divider>信息查询</Divider>
            <ButtonGrid data={infoButtonList} />
            <Divider>产品管理</Divider>
            <ButtonGrid data={productButtonList} />
          </Group>
          <Divider>账号操作</Divider>
          <RewardMutation userId={data.id} />
          <MoneyMutation userId={data.id} />
          <VipMutation userId={data.id} />
          <ButtonGrid data={operationButtonList} />
        </Group>
      </SideSheet>
    </>
  )
}
