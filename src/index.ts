import path from 'path'
import fetch from 'node-fetch'
import { Client, Message, MessageEmbed, TextChannel } from 'discord.js'
import { readJSONSync } from 'fs-extra'
import { splitSpacesExcludeQuotes } from 'quoted-string-space-split'

import Item from './classes/Item'
import Product from './classes/Product'
import removeColor from './utils/removeColor'
import getItem from './utils/getItem'
import product2embed from './utils/product2embed'

const client = new Client()
const PATH = path.resolve()
const { token, mariadb, prefix } = readJSONSync(PATH + '/settings.json')
const db = require('knex') ({
    client: 'mysql2',
    connection: {
        host     : mariadb.host,
        port     : mariadb.port,
        user     : mariadb.user,
        password : mariadb.password,
        database : mariadb.database
    }
})

const get = async (str: string) => await (await fetch(str)).json()
const getBin = (v: string | number) => {
    if (typeof(v) === 'string') {
        switch (v) {
            case 'bin': return 1
            case 'auction': return 2
            case 'any': return 0
            default: return 0
        }
    } else if (typeof(v) === 'number') {
        switch (v) {
            case 1: return 'bin'
            case 2: return 'auction'
            case 0: return 'any'
            default: return 'Error'
        }
    }
}

client.on('ready', async () => {
    console.log('[*] Ready')

    setInterval(async () => {
        await main()
    }, 60000)
})

client.on('message', async (msg) => {
    if (msg.author.bot) return
    if (!msg.content.startsWith(prefix)) return

    let args: string[] = splitSpacesExcludeQuotes(msg.content).slice(1)

    if (args[0] === '예약') {
        const price: number = +args[2]
        const isBin = getBin(args[3].toLowerCase())

        await db('channels').insert({ user: msg.author.id, channel_id: msg.channel.id, item_name: args[1], item_price: price, item_bin: isBin})
        msg.channel.send(new MessageEmbed({title: '✅ Success', description: '"' + args[1] + '" Successfully registered', color: 0x00FF00 }))
    } else if (args[0] === '목록') {
        const rows = await db('channels').select('*').where('user', msg.author.id)
        let embed: MessageEmbed = new MessageEmbed({ title: 'Item List', color: 0x00FF00 })
        rows.forEach((row: any) => {
            embed.addField(row.item_name, ':coin:: ' + row.item_price + '\n🛒: ' + getBin(row.item_bin))
        })
        msg.channel.send(embed)
    } else if (args[0] === '삭제') {
        const isSuccess = await db('channels').where({ user: msg.author.id, item_name: args[1] }).del()
        if (isSuccess) msg.channel.send(new MessageEmbed({ title: '✅ Success', description: '"' + args[1] + '" Deleted successfully', color: 0x00FF00 }))
        else msg.channel.send(new MessageEmbed({ title: '❎ Failed', description: 'failed', color: 0xFF0000}))
    }
})

async function main() {
    console.log('Loading...')
    const data = await get('https://api.hypixel.net/skyblock/auctions')
    if (!data.success) return
    let products: Product[] = new Array<Product>()
    for (let i = 0; i < data.auctions.length; i++) {
        const auctioneer = await get('https://sessionserver.mojang.com/session/minecraft/profile/' + data.auctions[i].auctioneer)
        products.push(new Product(
            data.auctions[i].uuid,
            auctioneer.name,
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
    
    const item: Item = new Item('Leggings', 400000000, 0)
    console.log(item)
    const item_list: Product[] = getItem(products, item)
    console.log(item_list)
    const embeds: MessageEmbed[] = product2embed(item_list)

    // embeds.forEach(async (embed) => {
    //     console.log('Sending...')
    //     setTimeout(() => { (client?.channels?.cache?.get(channel_id) as TextChannel)?.send(embed) }, 1000)
    // })
}

client.login(token)
