
export interface ThroneHolder {
  userId: string
  userName: string
  userAvatar?: string
  bidAmount: number
  heldSince: string
  totalDuration: number
  defenses: number
}

export interface ThroneBid {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  amount: number
  status: 'pending' | 'accepted' | 'rejected' | 'outbid'
  createdAt: string
}

export interface PlaceBidRequest {
  amount: number
}

export interface ThroneStats {
  currentHolder: ThroneHolder | null
  totalBids: number
  highestBid: number
  averageBid: number
  totalRevenue: number
  uniqueBidders: number
}

export interface ThroneLeaderboard {
  holders: Array<{
    userId: string
    userName: string
    userAvatar?: string
    totalDuration: number
    totalBids: number
    totalSpent: number
    rank: number
  }>
  total: number
}

export interface UserThroneHistory {
  userId: string
  totalTimeHeld: number
  totalBids: number
  totalSpent: number
  successfulBids: number
  currentStreak: number
  bids: ThroneBid[]
}

export interface ThroneRecord {
  id: string
  holderId: string
  holderName: string
  holderAvatar: string
  startDate: string
  endDate: string
  duration: string
  finalBid: number
}
