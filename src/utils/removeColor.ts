export default function removeColor(text: string): string {
    let result: string = text
    const colorCode: string[] = ['§0', '§1', '§2', '§3', '§4', '§5', '§6', '§7', '§8', '§9', '§a', '§b', '§c', '§d', '§e', '§f']
    for (let i = 0; i < colorCode.length; i++) result = result.replace(new RegExp(colorCode[i], 'gi'), '')
    return result
}