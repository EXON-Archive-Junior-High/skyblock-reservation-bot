export default class Item {
    name: string
    desired_price: number

    constructor(name: string, desired_price: number) {
        this.name = name
        this.desired_price = desired_price
    }
}