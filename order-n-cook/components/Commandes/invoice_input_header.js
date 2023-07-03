import { get_ai_style, get_confidence_level_text } from "./helpers";
import { useState } from "react";

export default function InvoiceInputHeader({
  aiData = null,
  setInvoiceAmount,
  invoiceAmount,
  setInvoiceNbValue,
  invoiceNbValue,
  setInvoiceDate,
  invoiceDate,
  setTaxAmount,
  taxAmount,
}) {
  setInvoiceAmount(
    aiData && aiData.total_ht && aiData.total_ht.answer
      ? aiData.total_ht.answer
      : null
  );
  setInvoiceNbValue(
    aiData && aiData.invoice_number && aiData.invoice_number.answer
      ? aiData.invoice_number.answer
      : null
  );
  setInvoiceDate(
    aiData && aiData.invoice_date.answer ? aiData.invoice_date.answer : null
  );
  setTaxAmount(
    aiData &&
      aiData.total_ttc &&
      aiData.total_ht &&
      aiData.total_ttc.answer &&
      aiData.total_ht.answer
      ? (aiData.total_ttc.answer - aiData.total_ht.answer).toFixed(2)
      : null
  );

  return (
    <>
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
    </>
  );
}
