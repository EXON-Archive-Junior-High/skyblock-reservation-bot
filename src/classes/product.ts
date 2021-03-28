class Product {
    constructor() {}

    auctioneer: string
    profile_id: string
    coop: string[]
    start: number
    end: number
    item_name: string
    item_lore: string
    extra: string
    category: string
    tier: string
    starting_bid: number
    item_bytes: string
    claimed: boolean
    claimed_bidders: string[]
    highest_bid_amount: number
    bids: [
        {
          auction_id: string,
          bidder: string,
          profile_id: string,
          amount: number,
          timestamp: number
        }
    ]
    bin: boolean
}