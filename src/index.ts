import path from 'path'
import fetch from 'node-fetch'
import { Client, MessageEmbed, TextChannel } from 'discord.js'
import { readJSONSync } from 'fs-extra'

import Item from './classes/Item'
import Product from './classes/Product'
import removeColor from './utils/removeColor'
import getItem from './utils/getItem'
import product2embed from './utils/product2embed'

const client = new Client()
const PATH = path.resolve()
const { token, channel_id } = readJSONSync(PATH + '/settings.json')

const get = async (str: string) => await (await fetch(str)).json()

client.on('ready', async () => {
    console.log('[*] Ready')
    
    setInterval(async () => {
        await main()
    }, 60000)
})

client.login(token)

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
            data.auctions[i].bin ? true : false
        ))
    }

    const item: Item = new Item('overflux', 4000000000, 0)
    const item_list: Product[] = getItem(products, item)
    const embeds: MessageEmbed[] = product2embed(item_list)

    embeds.forEach(async (embed) => {
        await (client?.channels?.cache?.get(channel_id) as TextChannel)?.send(embed)
    })
}

main()