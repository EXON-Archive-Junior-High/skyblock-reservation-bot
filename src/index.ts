import fetch from 'node-fetch'

import Product from './classes/product'

const get = async (str: string) => await (await fetch(str)).json()

async function main() {
    const data = await get('https://api.hypixel.net/skyblock/auctions')
    if (!data.success) return
    let products: Product[]
    for (let i = 0; i < data.auctions.length; i++) products.push(new Product(
        data.auctions.uuid,
        data.auctions.auctioneer,
        data.auctions.profile_id,
        data.auctions.coop,
        data.auctions.start,
        data.auctions.end,
        data.auctions.item_name,
        data.auctions.item_lore,
        data.auctions.extra,
        data.auctions.category,
        data.auctions.tier,
        data.auctions.starting_bid,
        data.auctions.item_bytes,
        data.auctions.claimed,
        data.auctions.clasimed_bidders,
        data.auctions.highest_bid_amount,
        data.auctions.bids,
        data.auctions.bin
    ))
}

main()