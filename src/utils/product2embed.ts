import { MessageEmbed } from 'discord.js'
import Product from '../classes/Product'
import getItemColor from './getItemColor'

export default function product2embed(products: Product[]): MessageEmbed[] {
    const embeds: MessageEmbed[] = new Array<MessageEmbed>()
    let i = 0
    products.forEach((product) => {
        const presentBid: number = product.bids.length ? product.bids[product.bids.length - 1].amount : product.starting_bid
        embeds[i] = new MessageEmbed({
            title: product.isBin ? '[Bin] ': '[Auction] ' + product.item_name + ' - ' + presentBid.toLocaleString('en-US') || presentBid + '원',
            author: {
                name: 'Hypixel',
                icon_url: 'https://avatars.githubusercontent.com/u/3840546?s=280&v=4'
            },
            color: getItemColor(product.tier),
            fields: [
                {
                    name: product.item_name,
                    value: product.item_lore
                }
            ],
            timestamp: new Date(),
            footer: {
                text: product.auctioneer
            }
        })
        i++
    })
    return embeds
}