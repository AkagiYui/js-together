interface UserMoneyLog {
  id: number
  time: number
  moneyBefore: number
  moneyChanged: number
  moneyNow: number
  callerFunc: string
}
