import { useState, useReducer } from "react";
import { Button } from "reactstrap";

function InvoiceManualInput({ commande }) {
  const [invoiceAmount, setInvoiceAmount] = useState(null);
  const [invoiceNbValue, setInvoiceNbValue] = useState(null);
  const [invoiceDate, setInvoiceDate] = useState(null);
  const [taxAmount, setTaxAmount] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [itemsOfInvoice, setItemsOfInvoice] = useState(commande.items);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
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
            value={invoiceNbValue}
            type="text"
            onChange={(event) => setInvoiceNbValue(event.target.value)}
          />
        </div>
        <div className="d-flex flex-row justify-content-center col-6 mt-1">
          <p className="me-2">Date de la facture:</p>
          <input
            type="date"
            value={invoiceDate}
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
            type="number"
            step="any"
            value={invoiceAmount}
            placeholder="Montant H.T"
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
      {invoiceAmount && invoiceNbValue ? (
        <div className="col-12 d-flex justify-content-center mt-1">
          <Button
            className="btn btn-primary"
            onClick={() => setShowDetails(true)}
          >
            Enregistrer
          </Button>
        </div>
      ) : null}
    </div>
  );
}
export default InvoiceManualInput;
