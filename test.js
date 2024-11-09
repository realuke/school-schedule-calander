const originalDate = "Sat Nov 09 2024";
const formattedDate = formatDate(originalDate);
console.log(formattedDate);

function formatDate(dateString) {
    const date = new Date(dateString);
    date.setDate(date.getDate()+1)
    return date.toISOString().split('T')[0];
}
