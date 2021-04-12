export default function getItemColor(tier: string): number {
    switch (tier) {
        case 'COMMON':
            return 0xffffff
        case 'UNCOMMON':
            return 0x55ff55
        case 'RARE':
            return 0x5555ff
        case 'EPIC':
            return 0xaa00aa
        case 'LEGENDARY':
            return 0xffaa00
        case 'MYSTIC':
            return 0xFF5555
        default:
            return 0x000000
    }
}