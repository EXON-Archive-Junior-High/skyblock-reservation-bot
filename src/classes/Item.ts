export default class Item {
    name: string
    desired_price: number
    isBin: number
    /**
     * @param {number} isBin 0 : any, 1 : bin, 2 : auction
    */

    constructor(name: string, desired_price: number, isBin: number) {
        this.name = name
        this.desired_price = desired_price
        this.isBin = isBin
    }
}