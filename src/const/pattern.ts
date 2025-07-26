const patternOutcome : RegExp = /Bayar (.+?) (\d+)\s*tanggal\s*(\d+\s+\w+\s+\d{4})\s*kategori\s*(\w+)/i;
const patternIncome : RegExp = /Masuk (.+?) (\d+)\s*tanggal\s*(\d+\s+\w+\s+\d{4})\s*kategori\s*(\w+)/i;


export {
    patternOutcome,
    patternIncome
}