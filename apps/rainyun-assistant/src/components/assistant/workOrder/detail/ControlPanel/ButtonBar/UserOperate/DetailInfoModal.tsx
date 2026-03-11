import { Button, Input, Modal } from "@douyinfe/semi-ui"
import { useUserInfoInList } from "@/hooks"
import { Group } from "@/components/Group"
import { IconGift, IconMail, IconPhone, IconRefresh, IconUserAdd } from "@douyinfe/semi-icons"
import { faClock, faLocationDot, faMapPin, faYenSign } from "@fortawesome/free-solid-svg-icons"
import { faAlipay, faQq, faWeixin } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { formatDateTime } from "@/utils"

interface Props {
  show: boolean
  onCloseClick?: () => void
  userId: number
}

const FontAwsomeInputIcon = ({ icon }) => {
  return <FontAwesomeIcon icon={icon} className="mx-8px w-16px" color="var(--semi-color-text-2)" />
}

export const DetailInfoModal = ({ show, onCloseClick, userId }: Props) => {
  const { data, refetch, isLoading } = useUserInfoInList({ userId: userId })

  return (
    <>
      <Modal
        className="semi-light-scrollbar"
        title={`用户详情` + (data?.name ? ` - ${data?.name} (ID: ${data?.id})` : "")}
        visible={show}
        onCancel={() => {
          onCloseClick && onCloseClick()
        }}
        centered
        width={800}
        bodyStyle={{}}
        footerFill
        footer={
          <Group justify="end">
            <Button
              icon={<IconRefresh spin={isLoading} />}
              onClick={() => {
                refetch()
              }}
            >
              刷新
            </Button>
          </Group>
        }
      >
        {data && (
          <Group vertical>
            <Group>
              <Input prefix={<IconMail />} suffix="邮箱" value={data.email} />
              <Input prefix={<IconPhone />} suffix="手机号" value={data.phone} />
            </Group>
            <Group>
              <Input prefix={<FontAwsomeInputIcon icon={faYenSign} />} suffix="余额" value={data.money} />
              <Input prefix={<IconGift />} suffix="积分" value={data.points} />
            </Group>

            <Group>
              <Input prefix={<FontAwsomeInputIcon icon={faQq} />} suffix="QQ号" value={data.qq || ""} />
              <Input
                prefix={<FontAwsomeInputIcon icon={faWeixin} />}
                suffix="微信OpenID"
                value={data.wechatOpenId || ""}
              />
            </Group>
            <Group>
              <Input prefix={<FontAwsomeInputIcon icon={faAlipay} />} suffix="支付宝账号" value={data.alipayAccount} />
              <Input prefix={<FontAwsomeInputIcon icon={faAlipay} />} suffix="支付宝姓名" value={data.alipayName} />
            </Group>
            <Group>
              <Input prefix={<FontAwsomeInputIcon icon={faMapPin} />} suffix="最后登录IP" value={data.lastIp} />
              <Input
                prefix={<FontAwsomeInputIcon icon={faClock} />}
                suffix="最后登录时间"
                value={formatDateTime(Number(data.lastLogin))}
              />
              <Input
                prefix={<FontAwsomeInputIcon icon={faLocationDot} />}
                suffix="最后登录地区"
                value={data.lastLoginArea}
              />
            </Group>
            <Group>
              <Input prefix={<IconUserAdd />} suffix="注册时间" value={formatDateTime(data.registerTime)} />
              <Input prefix={<IconUserAdd />} suffix="邀请人ID" value={data.inviter} />
              <Input prefix={<IconUserAdd />} suffix="注册来源" value={data.source} />
            </Group>

            <Group>
              <Input prefix={"是否代理"} value={data.isAgent ? "是" : "否"} />
              <Input prefix={"代理等级"} value={data.dlLevel} />
              <Input prefix={"代理钱包余额"} value={data.dlWallet} />
            </Group>

            <Group>
              <Input prefix={"账号是否有效"} value={data.valid ? "是" : "否"} />
              <Input prefix={"是否允许使用积分"} value={data.isAllowPointUse ? "是" : "否"} />
              <Input prefix={"是否开启登录二次验证"} value={data.isLoginEnableTfa ? "是" : "否"} />
            </Group>

            <Group>
              <Input prefix={"账号等级"} value={data.vipLevel} />
              <Input prefix={"登录次数"} value={data.loginCount} />
              <Input prefix={"退订次数"} value={data.unsubscribeCount} />
            </Group>
            <Group>
              <Input prefix={"邀请码"} value={data.shareCode} />
              <Input prefix={"身份组"} value={data.adminGroup} />
              <Input prefix={"封号原因"} value={data.banReason} />
            </Group>
          </Group>
        )}
      </Modal>
    </>
  )
}
