import { useState, useReducer } from "react";
import { Button } from "reactstrap";
import InvoiceInputHeader from "./invoice_input_header";
import { send_invoice_data } from "./helpers";

function InvoiceManualInput({ commande, closeModal }) {
  const [showDetails, setShowDetails] = useState(false);
  const [itemsOfInvoice, setItemsOfInvoice] = useState(
    commande.items.map((item) => {
      return { ...item, unit_quantity: item.real.quantity };
    })
  );
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [invoiceAmount, setInvoiceAmount] = useState(null);
  const [invoiceNbValue, setInvoiceNbValue] = useState(null);
  const [invoiceDate, setInvoiceDate] = useState(null);
  const [taxAmount, setTaxAmount] = useState(null);

  async function recordInvoice() {
    console.log(invoiceNbValue);
    console.log(invoiceDate);
    console.log(invoiceAmount);
    if (
      invoiceNbValue != null &&
      invoiceDate != null &&
      invoiceAmount != null
    ) {
      let items = itemsOfInvoice;
      items = items.map((item) => {
        console.log(item);
        if (Array.isArray(item.unit_quantity)) {
          item.unit_quantity = item.unit_quantity[0];
        }
        return {
          id: item.id,
          unit_price: item.unit_price ? item.unit_price.answer : null,
          quantity: item.quantity ? item.quantity.answer : null,
          unit_quantity: item.unit_quantity ? item.unit_quantity : null,
          unit: item.unit,
        };
      });
      const sending_was_successful = send_invoice_data(
        commande.id,
        invoiceNbValue,
        invoiceDate,
        invoiceAmount,
        taxAmount,
        items
      );
      if (sending_was_successful) {
        alert("La facture a bien été enregistrée. Merci.");
        closeModal();
      } else {
        alert(
          "Une erreur est survenue. Merci de vérifier la validité des valeurs renseignées (notamment la date de la facture qui ne peut pas être dans le passé) et de réessayer. Sinon, contactez le service technique."
        );
      }
    } else {
      alert(
        "Merci de renseigner le numéro de la facture ainsi que sa date et que le montant total HT facturé pour cette commande."
      );
    }
  }

  return (
    <div className="col-12 d-flex flex-column justify-content-center">
      {/* date montant HT numéro de facture montant avec taxes*/}
      <div className="d-flex flex-row justify-content-center col-12">
        <div
          className="d-flex flex-row justify-content-center col-6"
          style={{ fontWeight: 500 }}
        >
          <p className="me-2">Numéro de facture:</p>
          <input
            placeholder="Numéro de facture"
            value={invoiceNbValue}
            type="text"
            onChange={(event) => setInvoiceNbValue(event.target.value)}
          />
        </div>
        <div className="d-flex flex-row justify-content-center col-6 mt-1">
          <p className="me-2">Date de la facture:</p>
          <input
            value={invoiceDate}
            type="date"
            onChange={(event) => setInvoiceDate(event.target.value)}
          />
        </div>
      </div>
      <div className="d-flex flex-row justify-content-center col-12">
        <div
          className="d-flex flex-row justify-content-center col-6 mt-1"
          style={{ fontWeight: 500 }}
        >
          <p className="me-2">Montant HT:</p>
          <input
            placeholder="Montant H.T"
            type="number"
            step="any"
            value={invoiceAmount}
            onChange={(event) => setInvoiceAmount(event.target.value)}
          />
        </div>
        <div className="d-flex flex-row justify-content-center col-6 mt-1">
          <p className="me-2">Taxe divers:</p>
          <input
            type="number"
            step="any"
            placeholder="Montant des taxes"
            value={taxAmount}
            onChange={(event) => setTaxAmount(event.target.value)}
          />
        </div>
      </div>
      <div className="col-12 d-flex justify-content-end mt-2">
        <Button
          style={{
            backgroundColor: "transparent",
            color: "blue",
            textDecoration: "underline",
            border: 0,
          }}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Cacher les détails" : "Renseigner les détails"}
        </Button>
      </div>
      {showDetails ? (
        <div className="col-12 d-flex flex-column justify-content-center mt-1">
          {itemsOfInvoice.map((item) => (
            <div
              className="col-12 d-flex flex-row justify-content-between align-items-center p-3 mt-2 mb-2"
              style={{ borderRadius: "15px", backgroundColor: "#f3f0f0" }}
            >
              <div className="col-3" style={{ fontWeight: 500 }}>
                {item.name}
              </div>

              <div className="col-9 d-flex flex-column">
                <div className="d-flex col-12 justify-content-between align-items-center">
                  <p
                    style={{ fontWeight: 500, textAlign: "end" }}
                    className="flex-grow-1"
                  >
                    Vendu par unités de:{" "}
                  </p>
                  <input
                    type="number"
                    step="any"
                    className="col-3 ms-2 me-1"
                    value={item.unit_quantity}
                    onChange={(event) => {
                      const new_state = itemsOfInvoice;
                      new_state[new_state.indexOf(item)].unit_quantity =
                        event.target.value;
                      setItemsOfInvoice(new_state);
                      forceUpdate();
                    }}
                  />
                  <p style={{ fontSize: "14px" }}>{item.real.unit}</p>
                </div>
                <div className="d-flex justify-content-between col-12 mt-2 align-items-center">
                  <p
                    className="col-4 flex-grow-1"
                    style={{ fontWeight: 500, textAlign: "end" }}
                  >
                    Prix unitaire hors taxe:{" "}
                  </p>
                  <input
                    type="number"
                    className="col-3 ms-2 me-1"
                    step="any"
                    value={item.unit_price}
                    onChange={(event) => {
                      const new_state = itemsOfInvoice;
                      new_state[new_state.indexOf(item)].unit_price =
                        event.target.value;
                      setItemsOfInvoice(new_state);
                      forceUpdate();
                    }}
                  />
                  <p style={{ fontSize: "14px" }}>{"€/" + item.real.unit}</p>
                </div>
                <div className="d-flex col-12 justify-content-between align-items-center">
                  <p
                    style={{ fontWeight: 500, textAlign: "end" }}
                    className="flex-grow-1"
                  >
                    Nombre d'unités facturées sur cette commande:{" "}
                  </p>
                  <input
                    type="number"
                    step="any"
                    className="col-3 ms-2 me-1"
                    value={item.quantity}
                    onChange={(event) => {
                      const new_state = itemsOfInvoice;
                      new_state[new_state.indexOf(item)].quantity =
                        event.target.value;
                      setItemsOfInvoice(new_state);
                      forceUpdate();
                    }}
                  />
                  <p style={{ fontSize: "14px" }}>{item.real.unit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="col-12 d-flex justify-content-center mt-1">
        <Button className="btn btn-primary" onClick={recordInvoice}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
}
export default InvoiceManualInput;
