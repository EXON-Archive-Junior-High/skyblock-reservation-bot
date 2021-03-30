import fetch from 'node-fetch'

import Product from './classes/Product'
import removeColor from './utils/removeColor'

const get = async (str: string) => await (await fetch(str)).json()

async function main() {
    const data = await get('https://api.hypixel.net/skyblock/auctions')
    if (!data.success) return
    let products: Product[] = new Array<Product>()
    for (let i = 0; i < data.auctions.length; i++) {
        products.push(new Product(
            data.auctions[i].uuid,
            data.auctions[i].auctioneer,
            data.auctions[i].profile_id,
            data.auctions[i].coop,
            data.auctions[i].start,
            data.auctions[i].end,
            data.auctions[i].item_name,
            removeColor(data.auctions[i].item_lore),
            data.auctions[i].extra,
            data.auctions[i].category,
            data.auctions[i].tier,
            data.auctions[i].starting_bid,
            data.auctions[i].item_bytes,
            data.auctions[i].claimed,
            data.auctions[i].clasimed_bidders,
            data.auctions[i].highest_bid_amount,
            data.auctions[i].bids,
            data.auctions[i].bin
        ))
    }

    
}

main()