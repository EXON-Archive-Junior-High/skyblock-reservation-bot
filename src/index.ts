import fetch from 'node-fetch'

const get = async (str: string) => await (await fetch(str)).json()

async function main() {
    const a = await get('https://api.hypixel.net/skyblock/auctions')
    console.log(a)
}

main()