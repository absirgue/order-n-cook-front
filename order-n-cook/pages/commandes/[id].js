import {
  get_commande_status_color,
  DEFAULT_STATUS,
} from "../../components/Commandes/helpers";
import Link from "next/link";
import CommandeItemListItem from "../../components/Commandes/commande_item_list_item";
import ReceiveDeliveryButton from "../../components/Commandes/receive_delivery";
import AskAvoir from "../../components/Commandes/ask_avoir";
import ReceiveAvoir from "../../components/Commandes/receive_avoir";
import ReceiveInvoice from "../../components/Commandes/receive_invoice";
function getCommandeData() {
  return {
    id: 1,
    status: "WAITING_INVOICE",
    concerned_with_avoir: true,
    fournisseur: {
      name: "Anthès",
      specialty: "Frommager",
      category: "Crémier",
    },
    order_details: {
      identifier: "1030",
      date: "12/06/2023",
      means: "Commandée par mail",
    },
    delivery_details: {
      identifier: "BL1435",
      date: "14/06/2023",
    },
    scheduled_delivery_date: "14/06/2023",
    total_price: 100,
    items: [
      {
        id: 1,
        name: "beurre",
        conversion: {
          unit: "g",
          quantity: 250,
        },
        real: {
          unit: "plaquette",
          quantity: 1,
        },
        quantity: 3,
        kilogramme_price: 8,
        unit_price: 2,
        total_price: 6,
      },
      {
        id: 2,
        name: "crème liquide",
        conversion: {
          unit: "kg",
          quantity: 1,
        },
        real: {
          unit: "littre",
          quantity: 1.1,
        },
        quantity: 2,
        kilogramme_price: 1.9,
        unit_price: 5,
        total_price: 10,
        pending_avoir: true,
        // received_avoir: true,
      },
    ],
    avoir: {
      status: "demandé",
      date: "14/06/2023",
      items: [
        {
          name: "crème liquide",
          unit_price: 2,
          unit: "littre",
          quantity: 5,
          reason: "Article manquant",
        },
      ],
    },
  };
}

export async function getServerSideProps() {
  const commande = getCommandeData();
  return {
    props: { commande },
  };
}

function commandeHasBeenDelivered(commande) {
  return commande.status != "WAITING_DELIVERY";
}

function commandeReceivedAvoir(commande) {
  return commande.status === "AVOIR_RECEIVED_WAITING_INVOICE";
}

function commandeWasClosed(commande) {
  return commande.status === "CLOSED";
}

/**
 * Page to display Fournisseur details
 */
export default function FournisseurDetailPage({ commande }) {
  return (
    <div className="col-12 d-flex flex-column align-items-center">
      <div className="col-12 d-flex flex-row p-2 justify-content-between align-items-center">
        <div className="col-lg-2 col-md-2 col-1 justify-content-start align-items-start ms-3 vh-100">
          <Link href="/commandes/toutes">{"< Retour"}</Link>
        </div>
        <div className="col-lg-8 col-md-8 col-10 d-flex flex-column justify-content-start p-2 vh-100">
          <div
            className="col-12 d-flex flex-row justify-content-center p-2"
            style={{
              backgroundColor: get_commande_status_color(commande.status),
              borderRadius: "10px",
            }}
          >
            <h4 style={{ marginBottom: "0px" }}>
              {commande.fournisseur.name} |{" "}
              {
                DEFAULT_STATUS.filter(
                  (list) => list[0] === commande.status
                )[0][1]
              }
            </h4>
          </div>
          <div className="col-12 d-flex flex-row pt-3 pb-3 justify-content-center align-items-center">
            {commande.status === "WAITING_DELIVERY" ? (
              <ReceiveDeliveryButton
                commande={commande}
              ></ReceiveDeliveryButton>
            ) : commande.status === "WAITING_AVOIR" ? (
              <ReceiveAvoir commande={commande}></ReceiveAvoir>
            ) : commande.status === "WAITING_INVOICE" ? (
              <>
                <ReceiveInvoice commande={commande}></ReceiveInvoice>
                <div className="col-1"></div>
                <AskAvoir commande={commande}></AskAvoir>
              </>
            ) : commande.status === "AVOIR_RECEIVED_WAITING_INVOICE" ? (
              <ReceiveInvoice commande={commande}></ReceiveInvoice>
            ) : null}
          </div>
          <div className="col-12 d-flex flex-row justify-content-between align-items-center">
            <div className="col-10 d-flex flex-column justify-content-start align-items-start">
              <div className="col-12 d-flex flex-row justify-content-between">
                <p>{commande.fournisseur.name}</p>
                <p>
                  {commande.fournisseur.category} |{" "}
                  {commande.fournisseur.specialty}
                </p>
                <p></p>
              </div>
              <p style={{ color: "grey" }}>
                N° de commande:{" "}
                <span style={{ color: "black", fontWeight: 500 }}>
                  {commande.order_details.identifier}
                </span>{" "}
                |{" "}
                <span style={{ fontSize: "14px" }}>
                  {commande.order_details.means
                    ? commande.order_details.means
                    : null}
                  {commande.order_details.date
                    ? " le " + commande.order_details.date
                    : null}
                </span>
              </p>
              {commandeHasBeenDelivered(commande) ? (
                <p style={{ color: "grey" }}>
                  N° bon de livraison:{" "}
                  <span style={{ color: "black", fontWeight: 500 }}>
                    {commande.delivery_details.identifier}
                  </span>{" "}
                  |{" "}
                  <span style={{ fontSize: "14px" }}>
                    {commande.delivery_details.date
                      ? " le " + commande.delivery_details.date
                      : null}
                  </span>
                </p>
              ) : null}
              {commandeReceivedAvoir(commande) ? (
                <p>
                  Numéro de commande: {commande.order_details.identifier} |{" "}
                  {commande.order_details.means
                    ? commande.order_details.means
                    : null}
                  {commande.order_details.date
                    ? " le " + commande.order_details.date
                    : null}
                </p>
              ) : null}
              {commandeWasClosed(commande) ? (
                <p>
                  Numéro de commande: {commande.order_details.identifier} |{" "}
                  {commande.order_details.means
                    ? commande.order_details.means
                    : null}
                  {commande.order_details.date
                    ? " le " + commande.order_details.date
                    : null}
                </p>
              ) : null}
            </div>
          </div>
          <div
            className="col-12 d-flex flex-row justify-content-end align-items-center mt-4 p-1"
            style={{ backgroundColor: "#f3f0f0" }}
          >
            <p>
              Estimation de la commande:{" "}
              <span
                style={{
                  fontWeight: 500,
                  color:
                    commande.status === "WAITING_AVOIR"
                      ? "#f85959"
                      : commande.concerned_with_avoir
                      ? "#fa8144"
                      : null,
                }}
              >
                {commande.total_price}€ HT
              </span>
            </p>
          </div>
          <div className="col-12 d-flex flex-column justify-content-start align-items-center">
            {commande.items.map((item) => {
              return (
                <CommandeItemListItem
                  commandeItem={item}
                ></CommandeItemListItem>
              );
            })}
          </div>
        </div>

        <div className="col-lg-2 col-md-2 col-1">
          {/* Purposefully empty */}
        </div>
      </div>
    </div>
  );
}
