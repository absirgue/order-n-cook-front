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
import SeeAvoir from "../../components/Commandes/see_avoir";
import useSWR from "swr";
import { useRouter } from "next/router";
// function getCommandeData() {
//   return {
//     id: 1,
//     status: "WAITING_INVOICE",
//     concerned_with_avoir: true,
//     fournisseur: {
//       name: "Anthès",
//       specialty: "Frommager",
//       category: "Crémier",
//     },
//     order_details: {
//       identifier: "1030",
//       date: "12/06/2023",
//       means: "Commandée par mail",
//     },
//     delivery_details: {
//       identifier: "BL1435",
//       date: "14/06/2023",
//     },
//     scheduled_delivery_date: "14/06/2023",
//     total_price: 100,
//     items: [
//       {
//         id: 1,
//         name: "beurre",
//         conversion: {
//           unit: "g",
//           quantity: 250,
//         },
//         real: {
//           unit: "plaquette",
//           quantity: 1,
//         },
//         quantity: 3,
//         kilogramme_price: 8,
//         unit_price: 2,
//         total_price: 6,
//       },
//       {
//         id: 2,
//         name: "crème liquide",
//         conversion: {
//           unit: "kg",
//           quantity: 1,
//         },
//         real: {
//           unit: "littre",
//           quantity: 1.1,
//         },
//         quantity: 2,
//         kilogramme_price: 1.9,
//         unit_price: 5,
//         total_price: 10,
//         pending_avoir: true,
//         // received_avoir: true,
//       },
//     ],
//     avoir: {
//       items: [
//         {
//           name: "crème liquide",
//           unit_price: 2,
//           unit: "littre",
//           quantity: 5,
//           reason: "Article manquant",
//         },
//       ],
//     },
//   };
// }

function commandeHasBeenDelivered(commande) {
  return commande.status != "WAITING_DELIVERY";
}

function commandeConcernedWithAvoir(commande) {
  return (
    commande.status === "AVOIR_RECEIVED_WAITING_INVOICE" ||
    commande.status === "WAITING_AVOIR"
  );
}

function commandeWasClosed(commande) {
  return commande.status === "CLOSED";
}

const fetcher = (url) => fetch(url).then((res) => res.json());

/**
 * Page to display Fournisseur details
 */
export default function FournisseurDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  // Use a ternary operator to only fetch the data when the ID isn't undefined
  const { data: commande, error } = useSWR(
    id ? `http://127.0.0.1:8000/api/commandes/${id}/` : null,
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
  if (!commande) return <div>Chargement en cours ...</div>;
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
          {commande.status === "WAITING_DELIVERY" &&
          commande.expected_delivery_date ? (
            <div className="col-12 d-flex flex-row pt-5 justify-content-center align-items-center">
              Livraison prévue le: {commande.expected_delivery_date}
            </div>
          ) : null}

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
                  {commande.fournisseur.category}
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
              {commandeConcernedWithAvoir(commande) &&
              commande.avoir_details ? (
                <p style={{ color: "grey" }}>
                  Numéro d'avoir:{" "}
                  <span style={{ color: "black", fontWeight: 500 }}>
                    {" "}
                    {commande.avoir_details.identifier}{" "}
                  </span>
                  |{" "}
                  <span style={{ fontSize: "14px" }}>
                    {" "}
                    {commande.avoir_details.date
                      ? " le " + commande.avoir_details.date
                      : null}
                    {commande.avoir_details.amount
                      ? " de " + commande.avoir_details.amount + "€ HT"
                      : null}
                    {commande.avoir_details.was_received
                      ? " (reçu)"
                      : " (demandé, en attente)"}
                  </span>
                </p>
              ) : null}
              {commandeWasClosed(commande) ? (
                <p style={{ color: "grey" }}>
                  Numéro de facture:{" "}
                  <span style={{ color: "black", fontWeight: 500 }}>
                    {commande.invoice_details.number}
                  </span>{" "}
                  |{" "}
                  <span style={{ fontSize: "14px" }}>
                    {commande.invoice_details.date
                      ? " le " + commande.invoice_details.date
                      : null}{" "}
                    {commande.invoice_details.total_taxes
                      ? "avec " +
                        commande.invoice_details.total_taxes +
                        "€ de taxes"
                      : null}
                  </span>
                </p>
              ) : null}
            </div>
            <div className="col-2 d-flex flex-column justify-content-center align-items-center">
              {commande.concerned_with_avoir ? (
                <SeeAvoir commande={commande}></SeeAvoir>
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
                {commande.estimated_ht_total_cost}€ HT
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
