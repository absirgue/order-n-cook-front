import React from "react";
// import PlaceOrder from "./place_order";

// reactstrap components
import { Button } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import InvoiceManualInput from "./invoice_manual_input";
import AiAidedInput from "./invoice_ai_aided_input";

function ReceiveInvoice({ commande }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [aiData, setAiData] = React.useState(null);
  const [manualInput, setManualInput] = React.useState(false);
  const [aiAidedInput, setAiAidedInput] = React.useState(false);

  function closeModal() {
    setManualInput(null);
    setAiAidedInput(null);
    setSelectedFile(null);
    setModalOpen(false);
  }

  async function aiFileAnalysis(e) {
    e.preventDefault();
    if (selectedFile) {
      console.log(this.state);
      let form_data = new FormData();
      form_data.append("file", selectedFile, selectedFile.name);
      let url = `http://127.0.0.1:8000/api/receive_invoice/${commande.id}/`;
      axios
        .post(url, form_data, {
          headers: {
            "content-type": "multipart/form-data",
            // "content-disposition": "attachment; filename=upload.jpg",
          },
        })
        .then((res) => {
          if (res.status == 200) {
            console.log(res.data);
            setAiAidedInput(true);
            setAiData(res.data);
          } else {
            alert(
              "Une erreur est survenue lors de la lecture automatique de votre facture, merci de réessayer ou de renseigner les informations manuellement. Si ce problème persiste, merci de contacter le service technique."
            );
          }
        })
        .catch((err) => console.log(err));
    } else {
      alert(
        "Aucun fichier n'a été sélectionné. Veuillez en sélectionner un pour débuter l'analyse ou renseigner les détails de la facture manuellement."
      );
    }
  }

  // On file select (from the pop up)
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <>
      <Button
        className="btn btn-primary"
        onClick={() => setModalOpen(!modalOpen)}
      >
        Réceptionner la Facture
      </Button>
      <Modal
        size="lg"
        show={modalOpen}
        onHide={closeModal}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <div className="d-flex flex-row justify-content-between col-11 align-items-end">
            <Modal.Title id="example-modal-sizes-title-lg">
              Réceptionner la facture pour cette commande chez{" "}
              {commande.fournisseur.name}
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          {manualInput || aiAidedInput ? (
            aiAidedInput ? (
              <AiAidedInput commande={commande} aiData={aiData}></AiAidedInput>
            ) : (
              <InvoiceManualInput commande={commande}></InvoiceManualInput>
            )
          ) : (
            <div className="col-12 d-flex flex-column justify-content-center">
              <p
                className="col-12 mb-1"
                style={{ textDecoration: "underline" }}
              >
                Ajouter le fichier de la facture pour procéder à son analyse:
              </p>
              <div className="col-12 d-flex flex-row justify-content-center align-items-center">
                <input type="file" onChange={onFileChange} />
                <Button
                  className="btn btn-primary mt-1"
                  onClick={aiFileAnalysis}
                >
                  Lancer l'Analyse
                </Button>
              </div>
              <div className="col-12 mt-4 d-flex flex-row justify-content-center align-items-center">
                <p className="me-2">Ou</p>
                <Button
                  className="btn btn-success"
                  onClick={() => setManualInput(true)}
                >
                  Saisie Manuelle
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="col-12 d-flex flex-row justify-content-end">
            <Button onClick={closeModal}>Annuler</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ReceiveInvoice;
