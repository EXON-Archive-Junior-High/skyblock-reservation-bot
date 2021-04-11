import { MessageEmbed } from 'discord.js'
import Product from '../classes/Product'
import getItemColor from './getItemColor'

export default function product2embed(products: Product[]): MessageEmbed {
    const Embeds: MessageEmbed[] = new Array<MessageEmbed>()
    let i = 0
    products.forEach((product) => {
        const presentBid: number = product.bids.length ? product.bids[product.bids.length - 1] : product.starting_bid
        Embeds[i] = new MessageEmbed({
            title: product.item_name,
            author: {

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
                text: presentBid
            }
        })
        i++
    })
}