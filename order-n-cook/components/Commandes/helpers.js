export function get_commande_status_color(status) {
  return status === "WAITING_DELIVERY"
    ? "#f19494"
    : status === "WAITING_AVOIR"
    ? "#f85959"
    : status === "WAITING_INVOICE"
    ? "#f5a983"
    : status === "AVOIR_RECEIVED_WAITING_INVOICE"
    ? "#fa8144"
    : "#77af85";
}

export const DEFAULT_STATUS = [
  ["WAITING_DELIVERY", "En attente de livraison"],
  ["WAITING_AVOIR", "Livrée, en attente d'avoir"],
  ["WAITING_INVOICE", "Livrée, en attente de clotûre"],
  ["AVOIR_RECEIVED_WAITING_INVOICE", "Avoir reçu, en attente de clotûre"],
  ["CLOSED", "Commande clotûrée"],
];
