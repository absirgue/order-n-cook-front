import { useState, useReducer } from "react";
import { Button } from "reactstrap";
import {
  get_ai_style,
  get_confidence_level_text,
  send_invoice_data,
} from "./helpers";
import InvoiceInputHeader from "./invoice_input_header";

function AiAidedInput({ commande, aiData, closeModal }) {
  const [showDetails, setShowDetails] = useState(aiData != null);
  const [AiGeneratedItems, setAiGeneratedItems] = useState(aiData.items);
  const [invoiceAmount, setInvoiceAmount] = useState(
    aiData && aiData.total_ht && aiData.total_ht.answer
      ? aiData.total_ht.answer
      : null
  );
  const [invoiceNbValue, setInvoiceNbValue] = useState(
    aiData && aiData.invoice_number && aiData.invoice_number.answer
      ? aiData.invoice_number.answer
      : null
  );
  const [invoiceDate, setInvoiceDate] = useState(
    aiData && aiData.invoice_date.answer ? aiData.invoice_date.answer : null
  );
  const [taxAmount, setTaxAmount] = useState(
    aiData &&
      aiData.total_ttc &&
      aiData.total_ht &&
      aiData.total_ttc.answer &&
      aiData.total_ht.answer
      ? (aiData.total_ttc.answer - aiData.total_ht.answer).toFixed(2)
      : null
  );
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  async function recordInvoice() {
    if ((invoiceNbValue, invoiceDate, invoiceAmount)) {
      let items = AiGeneratedItems;
      items = items.map((item) => {
        if (item.unit_is_same) {
          return {
            id: item.id,
            unit_price: item.unit_price ? item.unit_price.answer : null,
            quantity: item.quantity ? item.quantity.answer : null,
          };
        } else {
          return {
            id: item.id,
            unit_price: item.unit_price ? item.unit_price.answer : null,
            quantity: item.quantity ? item.quantity.answer : null,
            unit_quantity: item.unit_quantity ? item.unit_quantity : null,
            unit: item.unit,
          };
        }
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
            title={
              aiData &&
              aiData.invoice_number &&
              aiData.invoice_number.confidence
                ? get_confidence_level_text(aiData.invoice_number.confidence)
                : null
            }
            type="text"
            style={aiData ? get_ai_style(aiData.invoice_number) : null}
            onChange={(event) => setInvoiceNbValue(event.target.value)}
          />
        </div>
        <div className="d-flex flex-row justify-content-center col-6 mt-1">
          <p className="me-2">Date de la facture:</p>
          <input
            value={invoiceDate}
            title={
              aiData && aiData.invoice_date && aiData.invoice_date.confidence
                ? get_confidence_level_text(aiData.invoice_date.confidence)
                : null
            }
            type="date"
            style={aiData ? get_ai_style(aiData.invoice_date) : null}
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
            title={
              aiData && aiData.total_ht && aiData.total_ht.confidence
                ? get_confidence_level_text(aiData.total_ht.confidence)
                : null
            }
            type="number"
            step="any"
            value={invoiceAmount}
            style={aiData ? get_ai_style(aiData.total_ht) : null}
            onChange={(event) => setInvoiceAmount(event.target.value)}
          />
        </div>
        <div className="d-flex flex-row justify-content-center col-6 mt-1">
          <p className="me-2">Taxe divers:</p>
          <input
            type="number"
            step="any"
            placeholder="Montant des taxes"
            title={
              aiData && aiData.total_ttc && aiData.total_ttc.confidence
                ? get_confidence_level_text(aiData.total_ttc.confidence)
                : null
            }
            value={taxAmount}
            style={aiData ? get_ai_style(aiData.total_ttc) : null}
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
          {AiGeneratedItems.map((item) =>
            item.unit_is_same ? (
              <div
                className="col-12 d-flex flex-row justify-content-between align-items-center p-3 mt-2 mb-2"
                style={{ borderRadius: "15px", backgroundColor: "#f3f0f0" }}
              >
                <div className="col-3" style={{ fontWeight: 500 }}>
                  {item.name}
                </div>

                <div className="col-9 d-flex flex-column">
                  <div className="d-flex justify-content-between col-12 mt-2 align-items-center">
                    <p
                      className="col-4 flex-grow-1"
                      style={{ fontWeight: 500, textAlign: "end" }}
                    >
                      Prix unitaire hors taxe:{" "}
                    </p>
                    <input
                      title={
                        item && item.unit_price && item.unit_price.confidence
                          ? get_confidence_level_text(
                              item.unit_price.confidence
                            )
                          : null
                      }
                      style={aiData ? get_ai_style(item.unit_price) : null}
                      type="number"
                      step="any"
                      className="col-3 ms-2 me-1"
                      value={
                        item.unit_price && item.unit_price.answer
                          ? item.unit_price.answer
                          : null
                      }
                      onChange={(event) => {
                        const new_state = AiGeneratedItems;
                        if (item.unit_price) {
                          new_state[new_state.indexOf(item)].unit_price.answer =
                            event.target.value;
                        } else {
                          new_state[new_state.indexOf(item)].unit_price = {
                            answer: event.target.value,
                          };
                        }
                        setAiGeneratedItems(new_state);
                        forceUpdate();
                      }}
                    />
                    <p style={{ fontSize: "14px" }}>{"€/" + item.unit}</p>
                  </div>
                  <div className="d-flex col-12 justify-content-between align-items-center mt-2">
                    <p
                      style={{ fontWeight: 500, textAlign: "end" }}
                      className="flex-grow-1"
                    >
                      Nombre d'unités facturées sur cette commande:{" "}
                    </p>
                    <input
                      title={
                        item && item.quantity && item.quantity.confidence
                          ? get_confidence_level_text(item.quantity.confidence)
                          : null
                      }
                      style={aiData ? get_ai_style(item.quantity) : null}
                      type="number"
                      step="any"
                      className="col-3 ms-2 me-1"
                      value={item.quantity.answer}
                      onChange={(event) => {
                        const new_state = AiGeneratedItems;
                        if (item.quantity) {
                          new_state[new_state.indexOf(item)].quantity.answer =
                            event.target.value;
                        } else {
                          new_state[new_state.indexOf(item)].quantity = {
                            answer: event.target.value,
                          };
                        }

                        setAiGeneratedItems(new_state);
                        forceUpdate();
                      }}
                    />
                    <p style={{ fontSize: "14px" }}>{item.unit}</p>
                  </div>
                </div>
              </div>
            ) : (
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
                      title={
                        "Estimation simplifiée, vueillez vérifier l'information."
                      }
                      type="number"
                      step="any"
                      className="col-3 ms-2 me-1"
                      value={item.unit_quantity}
                      onChange={(event) => {
                        const new_state = AiGeneratedItems;
                        new_state[new_state.indexOf(item)].unit_quantity =
                          event.target.value;
                        setAiGeneratedItems(new_state);
                        forceUpdate();
                      }}
                    />
                    {/* MAKE SELECT */}
                  </div>
                  <div className="d-flex col-12 justify-content-end align-items-end">
                    <select
                      className={"btn"}
                      style={{ textAlign: "start" }}
                      onChange={(e) => {
                        const new_state = AiGeneratedItems;
                        new_state[new_state.indexOf(item)].unit =
                          e.target.value;
                        setAiGeneratedItems(new_state);
                        forceUpdate();
                      }}
                      value={item.unit}
                    >
                      <option disabled value="default">
                        Unité
                      </option>
                      {item.possible_units.map((unit) => (
                        <option value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                  <div className="d-flex justify-content-between col-12 mt-2 align-items-center">
                    <p
                      className="col-4 flex-grow-1"
                      style={{ fontWeight: 500, textAlign: "end" }}
                    >
                      Prix unitaire hors taxe:{" "}
                    </p>
                    <input
                      title={
                        item && item.unit_price && item.unit_price.confidence
                          ? get_confidence_level_text(
                              item.unit_price.confidence
                            )
                          : null
                      }
                      style={aiData ? get_ai_style(item.unit_price) : null}
                      type="number"
                      step="any"
                      className="col-3 ms-2 me-1"
                      value={item.unit_price.answer}
                      onChange={(event) => {
                        const new_state = AiGeneratedItems;
                        if (item.unit_price) {
                          new_state[new_state.indexOf(item)].unit_price.answer =
                            event.target.value;
                        } else {
                          new_state[new_state.indexOf(item)].unit_price = {
                            answer: event.target.value,
                          };
                        }
                        setAiGeneratedItems(new_state);
                        forceUpdate();
                      }}
                    />
                    <p style={{ fontSize: "14px" }}>{"€/" + item.unit}</p>
                  </div>
                  <div className="d-flex col-12 justify-content-between align-items-center">
                    <p
                      style={{ fontWeight: 500, textAlign: "end" }}
                      className="flex-grow-1"
                    >
                      Nombre d'unités facturées sur cette commande:{" "}
                    </p>
                    <input
                      title={
                        item && item.quantity && item.quantity.confidence
                          ? get_confidence_level_text(item.quantity.confidence)
                          : null
                      }
                      style={aiData ? get_ai_style(item.quantity) : null}
                      type="number"
                      step="any"
                      className="col-3 ms-2 me-1"
                      value={item.quantity.answer}
                      onChange={(event) => {
                        const new_state = AiGeneratedItems;
                        if (item.quantity) {
                          new_state[new_state.indexOf(item)].quantity.answer =
                            event.target.value;
                        } else {
                          new_state[new_state.indexOf(item)].quantity = {
                            answer: event.target.value,
                          };
                        }
                        setAiGeneratedItems(new_state);
                        forceUpdate();
                      }}
                    />
                    <p style={{ fontSize: "14px" }}>{item.unit}</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : null}
      {invoiceAmount && invoiceNbValue ? (
        <div className="col-12 d-flex justify-content-center mt-1">
          <Button className="btn btn-primary" onClick={recordInvoice}>
            Enregistrer
          </Button>
        </div>
      ) : null}
    </div>
  );
}
export default AiAidedInput;
