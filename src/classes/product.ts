export default class Product {
    constructor(
        uuid: string,
        auctioneer: string,
        profile_id: string,
        coop: string[],
        start: number,
        end: number,
        item_name: string,
        item_lore: string,
        extra: string,
        category: string,
        tier: string,
        starting_bid: number,
        item_bytes: string,
        claimed: boolean,
        claimed_bidders: string[],
        highest_bid_amount: number,
        bids: [
            {
              auction_id: string,
              bidder: string,
              profile_id: string,
              amount: number,
              timestamp: number
            }
        ],
        isBin: boolean
    ) {
        this.uuid = uuid
        this.auctioneer = auctioneer
        this.profile_id = profile_id
        this.coop = coop
        this.start = start
        this.end = end
        this.item_name = item_name
        this.item_lore = item_lore
        this.extra = extra
        this.category = category
        this.tier = tier
        this.starting_bid = starting_bid
        this.item_bytes = item_bytes
        this.claimed = claimed
        this.claimed_bidders = claimed_bidders
        this.highest_bid_amount = highest_bid_amount
        this.bids = bids
        this.isBin = isBin
    }

    uuid: string
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
    isBin: boolean
}