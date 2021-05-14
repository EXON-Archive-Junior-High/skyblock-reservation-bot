import path from 'path'
import fetch from 'node-fetch'
import { Client, MessageEmbed, TextChannel } from 'discord.js'
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

    if (args[0] === 'add') {
        console.log(`[Add] ${msg.author.id}(${msg.channel.id}) : ${args[1]}`)

        const price: number = +args[2]
        const isBin = getBin(args[3].toLowerCase())

        const rows = await db(mariadb.table).select('*').where('user', msg.author.id).where('item_name', args[1])
        console.log(rows)
        if (rows.length === 0) {
            await db(mariadb.table).insert({ user: msg.author.id, channel_id: msg.channel.id, item_name: args[1], item_price: price, item_bin: isBin})
            msg.channel.send(new MessageEmbed({title: '✅ Success', description: '"' + args[1] + '" Successfully registered', color: 0x00FF00 }))
        } else
            msg.channel.send(new MessageEmbed({title: '❎ Failed', description: 'already exists', color: 0xFF0000 }))

        
    } else if (args[0] === 'list') {
        console.log(`[List] ${msg.author.id}(${msg.channel.id})`)

        const rows = await db(mariadb.table).select('*').where('user', msg.author.id)
        let embed: MessageEmbed = new MessageEmbed({ title: 'Item List', color: 0x00FF00 })
        rows.forEach((row: any) => {
            embed.addField(row.item_name, ':coin:: ' + row.item_price + '\n🛒: ' + getBin(row.item_bin))
        })
        msg.channel.send(embed)
    } else if (args[0] === 'delete' || args[0] === 'remove') {
        console.log(`[Delete] ${msg.author.id}(${msg.channel.id}) : ${args[1]}`)

        const isSuccess = await db(mariadb.table).where({ user: msg.author.id, item_name: args[1] }).del()
        if (isSuccess) msg.channel.send(new MessageEmbed({ title: '✅ Success', description: '"' + args[1] + '" Deleted successfully', color: 0x00FF00 }))
        else msg.channel.send(new MessageEmbed({ title: '❎ Failed', description: 'failed', color: 0xFF0000 }))
    } else if (args[0] === 'help') {
        console.log(`[Help] ${msg.author.id}(${msg.channel.id})`)

        msg.channel.send(new MessageEmbed({
            title: 'Help',
            description: 'hi',
        }))
    }
})

async function main() {
    const data = await get('https://api.hypixel.net/skyblock/auctions')
    if (!data.success) return
    let products: Product[] = new Array<Product>()
    for (let i = 0; i < data.auctions.length; i++) {
        // const auctioneer = await get('https://sessionserver.mojang.com/session/minecraft/profile/' + data.auctions[i].auctioneer)
        products.push(new Product(
            data.auctions[i].uuid,
            data.auctions[i].auctioneer,
            data.auctions[i].profile_id,
            data.auctions[i].coop,
            data.auctions[i].start,
            data.auctions[i].end,
            data.auctions[i].item_name.toLowerCase(),
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

    const reservations = await db(mariadb.table).select('*')
    let overlap: any
    reservations.forEach((reservation: any) => {
        const item: Item = new Item(reservation.item_name, reservation.item_price, reservation.item_bin)
        const item_list: Product[] = getItem(products, item)
        const embeds: MessageEmbed[] = product2embed(item_list)
        
        let i = 0
        embeds.forEach(async (embed) => {
            if (!(overlap[item.name].indexOf(item_list[i].uuid) > -1)) {
                overlap[item.name].append(item_list[i].uuid)
                setTimeout(async () => {
                    (client?.channels?.cache?.get(reservation.channel_id) as TextChannel)?.send(embed)
                }, 1000)
            }
            i++
        })
    })
}

client.login(token)
