import Item from '../classes/Item'
import Product from '../classes/Product'

export default function getItem(products: Product[], item: Item): Product[] {
    let result: Product[] = new Array<Product>()
    products.forEach(product => {
        const presentBid = product.bids.length ? product.bids[product.bids.length - 1].amount : product.starting_bid
        if (item.isBin === 0 && product.item_name.includes(item.name.toLocaleLowerCase()) && presentBid <= item.desired_price) result.push(product)
        if (item.isBin === 1 && product.isBin && product.item_name.includes(item.name.toLocaleLowerCase()) && presentBid <= item.desired_price) result.push(product)
        if (item.isBin === 2 && !product.isBin && product.item_name.includes(item.name.toLocaleLowerCase()) && presentBid <= item.desired_price) result.push(product)
    })
    return result
}