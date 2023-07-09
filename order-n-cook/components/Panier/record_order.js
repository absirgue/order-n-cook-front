import { useState } from "react";
import { Button } from "reactstrap";
import Modal from "react-bootstrap/Modal";
import DeliveryDaysDisplay from "../Fournisseurs/delivery_days_display";
import useSWR from "swr";
import { useRouter } from "next/router";
import { create_commande } from "../../utils/backend/commandes_requests";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../../redux/cart.slice";
import { DAYS_OF_THE_WEEK } from "../../utils/general_constants";
const fetcher = (url) => fetch(url).then((res) => res.json());
/**
 * Page to display RecetteDetails
 */

export default function RecordOrder({ items }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [orderMean, setOrderMean] = useState(null);
  const [emailNote, setEmailNote] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [dayError, setDayError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  async function downloadPDFFromAPIAnswer(response, fournisseur_name) {
    const result = await response.blob();
    const url = window.URL.createObjectURL(result);
    const link = document.createElement("a");
    link.href = url;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + "/" + mm + "/" + yyyy;
    link.setAttribute(
      "download",
      `[Bon de Commande]${fournisseur_name}-${today}.pdf`
    );
    document.body.append(link);
    link.click();
  }

  async function record_order() {
    if (orderMean != null && items[0].fournisseur_id) {
      if (dayError != null) {
        alert(
          dayError + " Merci de sélectionner une autre date pour la livraison."
        );
        return;
      }
      let data = {};
      data["items"] = items.map((produit) => {
        return {
          produit: produit.id,
          quantity: produit.quantity,
          unit_quantity: produit.real_unit.quantity,
          unit: produit.real_unit.unit,
          unit_price: produit.price,
          kilogramme_price: produit.kilogramme_price,
        };
      });
      let order_mean_text = "";
      if (orderMean == "cash_out") {
        order_mean_text = "Opérée en sortie de caisse";
      } else if (orderMean == "in_person") {
        order_mean_text = "Commandée en physique";
      } else if (orderMean == "by_phone") {
        order_mean_text = "Commandée au téléphone";
      } else if (orderMean == "by_email") {
        order_mean_text = "Commandée par mail";
      }
      data["ordering_mean"] = order_mean_text;
      data["fournisseur"] = items[0].fournisseur_id;
      data["estimated_ht_total_cost"] = items
        .reduce((total, item) => (total += item.quantity * item.price), 0)
        .toFixed(2);
      data["expected_delivery_date"] = deliveryDate;
      data["email_note"] = emailNote;

      const response = await create_commande(data);
      if (response.status == 201) {
        alert(
          'Votre commande a bien été passée! Vous pouvez la retrouver dans la section "Mes Commande". Merci!'
        );
        await downloadPDFFromAPIAnswer(response, items[0].fournisseur_name);
        for (let i = 0; i < items.length; i++) {
          dispatch(removeFromCart(items[i].id));
        }
      } else {
        alert(
          "Nous ne pouvons pas passer cette commande actuellement. Merci de réessayer ultérieurement ou de contacter le service technique."
        );
      }
    } else {
      alert("Merci de sélectionner un moyen de commande.");
    }
    setModalOpen(false);
  }
  // Use a ternary operator to only fetch the data when the ID isn't undefined
  const { data: fournisseur_data, error } = useSWR(
    `http://127.0.0.1:8000/api/fournisseur/order_data/${items[0].fournisseur_id}/`,
    fetcher
  );

  if (error) {
    return (
      <div>
        Une erreur est survenue lors du chargement de la page. Si cette erreur
        persiste, contactez le service technique.
      </div>
    );
  }
  if (!fournisseur_data) return <div>Chargement en cours ...</div>;
  return (
    <>
      <Button
        className="btn btn-primary"
        onClick={() => {
          setModalOpen(!modalOpen);
        }}
      >
        Passer commande
      </Button>
      <Modal
        size="lg"
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <div className="d-flex flex-row justify-content-between col-11 align-items-end">
            <Modal.Title id="example-modal-sizes-title-lg">
              Passer commande chez {items[0].fournisseur_name}
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div
            className="col-12 d-flex flex-row justify-content-center align-items-start mb-2 pb-3"
            style={{
              border: "solid",
              borderBottomWidth: "1px",
              borderTop: 0,
              borderLeft: 0,
              borderRight: 0,
              borderColor: "#c2c1d1",
            }}
          >
            <div className="col-6 d-flex flex-column">
              <div className="col-12 d-flex flex-row justify-content-start">
                <p
                  className="col-5 greyed-label me-2"
                  style={{ textAlign: "end" }}
                >
                  Email de commande:
                </p>
                <p>
                  {fournisseur_data.ordering_email
                    ? fournisseur_data.ordering_email
                    : "-"}
                </p>
              </div>
              <div className="col-12 d-flex flex-row justify-content-start">
                <p
                  className="col-5 greyed-label me-2"
                  style={{ textAlign: "end" }}
                >
                  Email principal:
                </p>
                <p>
                  {fournisseur_data.principal_email
                    ? fournisseur_data.principal_email
                    : "-"}
                </p>
              </div>
            </div>
            <div className="col-6 d-flex flex-column align-items-start">
              <div className="col-12 d-flex flex-row justify-content-start">
                <p
                  className="col-7 greyed-label me-2"
                  style={{ textAlign: "end" }}
                >
                  Téléphone de commande:
                </p>
                <p>
                  {fournisseur_data.ordering_phone_number
                    ? fournisseur_data.ordering_phone_number
                    : "-"}
                </p>
              </div>
              <div className="col-12 d-flex flex-row justify-content-start">
                <p
                  className="col-7 greyed-label me-2"
                  style={{ textAlign: "end" }}
                >
                  Téléphone principal:
                </p>
                <p>
                  {fournisseur_data.principal_phone_number
                    ? fournisseur_data.principal_phone_number
                    : "-"}
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 d-flex flex-column justify-content-center align-items-start mb-4">
            <DeliveryDaysDisplay
              fournisseurData={fournisseur_data}
            ></DeliveryDaysDisplay>
            <p>
              <i>Dernière heure de commande: </i>
              {fournisseur_data.last_order_time ? (
                fournisseur_data.last_order_time
              ) : (
                <span className="greyed-label">Non renseignée</span>
              )}
            </p>
          </div>
          <div className="col-12 d-flex flex-row justify-content-center align-items-start">
            <div
              className="ps-5 d-flex flex-column col-6"
              onChange={(event) => setOrderMean(event.target.value)}
            >
              {fournisseur_data.ordering_email &&
              fournisseur_data.ordering_email != "" ? (
                <div className="d-flex flex-row">
                  {" "}
                  <input
                    type="radio"
                    value="by_email"
                    name="order_mean"
                    className="me-2"
                  />{" "}
                  Commander par email
                </div>
              ) : null}

              <div className="d-flex flex-row">
                {" "}
                <input
                  type="radio"
                  value="by_phone"
                  name="order_mean"
                  className="me-2"
                />{" "}
                Commander par téléphone
              </div>
              <div className="d-flex flex-row">
                {" "}
                <input
                  type="radio"
                  value="in_person"
                  name="order_mean"
                  className="me-2"
                />{" "}
                Commander en physique
              </div>
              <div className="d-flex flex-row">
                {" "}
                <input
                  type="radio"
                  value="cash_out"
                  name="order_mean"
                  className="me-2"
                />{" "}
                Sortie de caisse
              </div>
            </div>
            <div className="col-6 d-flex flex-column align-items-center justify-content-center">
              {orderMean === "by_email" ? (
                <textarea
                  id="email_note"
                  name="email_note"
                  rows="3"
                  cols="50"
                  className="col-9"
                  placeholder="Note à inclure dans l'email"
                  style={{ borderColor: "#c2c1d1" }}
                  onChange={(event) => setEmailNote(event.target.value)}
                />
              ) : null}
            </div>
          </div>
          {orderMean && orderMean != "cash_out" ? (
            <div className="col-12 d-flex flex-column justify-content-start align-items-center mt-3">
              {" "}
              <p>Date de livraison:</p>
              <input
                className="col-4 pt-2 pb-2"
                type="date"
                onChange={(event) => {
                  const date = new Date(event.target.value);
                  const dayOfTheWeek = date.getDay();
                  if (
                    (dayOfTheWeek == 1 && fournisseur_data.delivers_monday) ||
                    (dayOfTheWeek == 2 && fournisseur_data.delivers_tuesday) ||
                    (dayOfTheWeek == 3 &&
                      fournisseur_data.delivers_wednesday) ||
                    (dayOfTheWeek == 4 && fournisseur_data.delivers_thursday) ||
                    (dayOfTheWeek == 5 && fournisseur_data.delivers_friday) ||
                    (dayOfTheWeek == 6 && fournisseur_data.delivers_saturday) ||
                    (dayOfTheWeek == 0 && fournisseur_data.delivers_sunday)
                  ) {
                    setDeliveryDate(event.target.value);
                    setDayError(null);
                  } else {
                    setDayError(
                      items[0].fournisseur_name +
                        " ne livre pas le " +
                        DAYS_OF_THE_WEEK[dayOfTheWeek]
                    );
                  }
                }}
              />
              {dayError ? <p style={{ color: "red" }}>{dayError}</p> : null}
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <div className="col-12 d-flex flex-row justify-content-end">
            {orderMean != null ? (
              <Button className="btn btn-primary me-4" onClick={record_order}>
                Commander
              </Button>
            ) : null}
            <Button onClick={() => setModalOpen(false)}>Annuler</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
