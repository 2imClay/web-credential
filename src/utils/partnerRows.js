export const PARTNER_ROW_COUNT = 3

function isValidRow(row) {
  const value = Number(row)
  return Number.isInteger(value) && value >= 1 && value <= PARTNER_ROW_COUNT
}

export function groupPartnersByRow(items = []) {
  const rows = Array.from({ length: PARTNER_ROW_COUNT }, () => [])
  const legacyItems = items.filter((item) => !isValidRow(item.row))
  let legacyIndex = 0

  items.forEach((item) => {
    let row = Number(item.row)

    if (!isValidRow(row)) {
      row = Math.min(
        PARTNER_ROW_COUNT,
        Math.floor((legacyIndex * PARTNER_ROW_COUNT) / Math.max(legacyItems.length, 1)) + 1
      )
      legacyIndex += 1
    }

    rows[row - 1].push({ ...item, row })
  })

  return rows
}
