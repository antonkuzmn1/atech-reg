export const getDateMonthForInput = (year: number, month: number) => {
    const monthString = month < 10 ? '0' + month : month;
    return `${year}-${monthString}`;
}
