

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const dateFormat = (date) => {
    try {
        return date.toISOString().split("T")[0];
    } catch (error) {
        console.log(error);
    }

}
const formatPhone = (value) => value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2");
const formatFixPhone = (value) => formatPhone(value).replace(/(\d)(\d{4})$/, "$1-$2");
const formatCellPhone = (value) => formatPhone(value).replace(/(\d{5})(\d{4})$/, "$1-$2");

export { emailRegex, dateFormat, formatFixPhone, formatCellPhone };