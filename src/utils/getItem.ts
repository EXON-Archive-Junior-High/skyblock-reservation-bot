import Item from '../classes/Item'
import Product from '../classes/Product'

export default function getItem(products: Product[], item: Item) {
    products.forEach(product => {
        const presentBid = product.bids.length ? product.bids[product.bids.length - 1] : product.starting_bid
        if (item.isBin === 0 && product.item_name === item.name && presentBid <= item.desired_price)
            console.log(product)
        if (item.isBin === 1 && product.isBin && product.item_name === item.name && presentBid <= item.desired_price)
            console.log(product)
        if (item.isBin === 2 && !product.isBin && product.item_name === item.name && presentBid <= item.desired_price)
            console.log(product)
    })
}