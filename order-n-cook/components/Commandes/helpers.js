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

export function get_ai_style(obj) {
  if (obj) {
    const confidence = obj.confidence;
    if (confidence) {
      let color_code = "";
      if (confidence < 30) {
        color_code = "#e72131";
      } else if (confidence < 50) {
        console.log("IN THE RIGHT");
        color_code = "#e0801b";
      } else if (confidence < 70) {
        color_code = "#cddc39";
      } else if (confidence < 90) {
        color_code = "#8bc34a";
      } else {
        color_code = "#4caf50";
      }
      return { color: color_code };
    } else {
      return { color: "#636c72" };
    }
  }
}

export function get_confidence_level_text(confidence) {
  return `Proposition avec ${confidence.toFixed(2)}% de confiance`;
}

export async function send_invoice_data(
  commande_id,
  invoiceNb,
  invoiceDate,
  invoiceAmount,
  invoiceTax,
  items
) {
  let data = {};
  if (invoiceNb) {
    data["number"] = invoiceNb;
  }
  if (invoiceDate) {
    data["date_created"] = invoiceDate;
  }
  if (invoiceAmount) {
    data["total_amount_ht"] = invoiceAmount;
  }
  if (invoiceTax) {
    data["total_taxes"] = invoiceTax;
  }
  if (items) {
    data["items"] = items;
  }

  const JSONdata = JSON.stringify(data);

  // API endpoint where we send form data.
  const endpoint = `http://127.0.0.1:8000/api/receive_invoice/${commande_id}/`;

  // Form the request for sending data to the server.
  const options = {
    responseType: "arraybuffer",
    // The method is POST because we are sending data.
    method: "PUT",
    // Tell the server we're sending JSON.
    headers: {
      "Content-Type": "application/json",
    },
    // Body of the request is the JSON data we created above.
    body: JSONdata,
  };

  // Send the form data to our forms API on Vercel and get a response.
  const response = await fetch(endpoint, options);

  return response.status === 200;
}
