import styles from "@styles/Cliente.module.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getStatusClass = (status) => {
  switch (status) {
    case "PROCESSING":
      return styles.td_sit_compra_processando;
    case "COMPLETED":
      return styles.td_sit_compra_completado;
    case "CANCELLED":
      return styles.td_sit_compra_cancelado;
    default:
      return "";
  }
};
export const getStatusClassEvent = (status) => {
  switch (status) {
    case "PLANNED":
      return styles.td_sit_evento_planejado;
    case "IN_PROGRESS":
      return styles.td_sit_evento_em_curso;
    case "COMPLETED":
      return styles.td_sit_evento_completado;
    case "CANCELLED":
      return styles.td_sit_evento_cancelado;
    default:
      return "";
  }
};
export const getStatusStringEvent = (status) => {
  switch (status) {
    case "PLANNED":
      return "Planejado";
    case "IN_PROGRESS":
      return "Em curso";
    case "COMPLETED":
      return "Realizado";
    case "CANCELLED":
      return "Cancelado";
    default:
      return "";
  }
};
const dateFormat = (date) => {
  try {
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.log(error);
  }
};
export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return date.toLocaleDateString("pt-BR", options);
}
export const getFullAddress = (location) => {
  const address = `${location.address_type}: ${location.address}, ${location.number}, ${location.city} - ${location.uf}, ${location.zip_code}`;
  return address.replace(/\s{2,}/g, ' ');
};

const formatPhone = (value) =>
  value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2");
const formatFixPhone = (value) =>
  formatPhone(value).replace(/(\d)(\d{4})$/, "$1-$2");
const formatCellPhone = (value) =>
  formatPhone(value).replace(/(\d{5})(\d{4})$/, "$1-$2");

// Função para obter o timestamp UNIX correspondente ao primeiro segundo do dia atual
export const getStartOfDayTimestamp = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Define a hora para 00:00:00
  return Math.floor(today.getTime()); // Retorna o timestamp UNIX
};
// Função para obter o timestamp UNIX correspondente ao último segundo do último dia do mês seguinte
export const getLastdayOfNextMonthTimestamp = () => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
  nextMonth.setHours(0, 0, 0, 0); // Define a hora para 00:00:00
  return Math.floor(nextMonth.getTime()); // Retorna o timestamp UNIX
};

export { emailRegex, dateFormat, formatFixPhone, formatCellPhone };
