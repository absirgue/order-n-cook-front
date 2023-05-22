import DeliveryDaysDisplay from "../../components/Fournisseurs/delivery_days_display";
import FournisseurProduitsDisplay from "../../components/Fournisseurs/produits_display";
import Link from "next/link";
import { useState } from "react";
import FicheContact from "../../components/Fournisseurs/fiche_contact";
function getIngredientData() {
  return {
    id: 1,
    name: "Anthès",
    last_order_time: "16h30",
    category: "Crèmerie",
    specialty: "Maître Frommager",
    address: "12 avenue de la Gare",
    address_line_2: "3e étage",
    postal_code: "12600",
    city: "Villefranche",
    department: "Aveyron",
    country: "France",
    client_code: "CECIESTEST",
    principal_phone_number: "0789654567",
    ordering_phone_number: "0719651567",
    // accounting_phone_number: "0719651567",
    principal_email: "anthes@test.org",
    ordering_email: "anthes@test.org",
    cc_sales_email: "anthes@test.org",
    // last_time_to_order:"16h",
    delivers_monday: true,
    delivers_tuesday: false,
    delivers_wednesday: false,
    delivers_thursday: false,
    delivers_friday: true,
    delivers_saturday: true,
    delivers_sunday: true,
    produits: [
      {
        ingredient: {
          name: "crème",
          labels: [
            { id: 1, name: "AOC" },
            { id: 2, name: "AOP" },
          ],
          id: 2,
          allergenes: [
            { id: 1, name: "noix" },
            { id: 2, name: "lactose" },
          ],
          season: [
            true,
            true,
            true,
            false,
            true,
            false,
            false,
            false,
            true,
            true,
            true,
            true,
          ],
          category: "crémerie",
          sous_category: "crème",
        },
        real_data: {
          quantity: 1,
          unit: "plaquette",
        },
        conversion: {
          quantity: 250,
          unit: "gramme",
        },
        price: 5.5,
        kilogramme_price: 22,
        last_known_price: 5,
        date_last_known_price: "12/12/1492",
      },
      {
        ingredient: {
          name: "beurre",
          category: "crémerie",
          sous_category: "beurre",
          season: [
            true,
            true,
            true,
            false,
            true,
            false,
            false,
            false,
            true,
            true,
            true,
            true,
          ],
          id: 2,
        },
        real_data: {
          quantity: 1,
          unit: "kilogramme",
        },
        conversion: {
          quantity: 250,
          unit: "gramme",
        },
        price: 15,
      },
      {
        ingredient: {
          name: "mozarella",
          category: "crémerie",
          sous_category: "frommage",
          season: [
            true,
            true,
            true,
            false,
            true,
            false,
            false,
            false,
            true,
            true,
            true,
            true,
          ],
          id: 2,
        },
        real_data: {
          quantity: 1,
          unit: "unité",
        },
        conversion: {
          quantity: 300,
          unit: "gramme",
        },
        price: 4,
        kilogramme_price: 15,
        last_known_price: 4,
      },
      {
        ingredient: {
          name: "crème épaisse",
          labels: [{ id: 1, name: "AOC" }],
          category: "crémerie",
          sous_category: "crème",
          season: [
            true,
            true,
            true,
            false,
            true,
            false,
            false,
            false,
            true,
            true,
            true,
            true,
          ],
          id: 2,
        },
        real_data: {
          quantity: 1,
          unit: "pot",
        },
        conversion: {
          quantity: 300,
          unit: "gramme",
        },
        price: 5.25,
        kilogramme_price: 22,
        last_known_price: 6,
      },
    ],
  };
}

export const getStaticProps = async (context) => {
  const ingredientID = context.params?.id;
  const fournisseurData = getIngredientData();
  return {
    props: {
      fournisseurData,
    },
  };
};

export const getStaticPaths = async () => {
  const data = { stars: [{ id: "1" }] };
  const pathsWithParams = data.stars.map((star) => ({
    params: { id: star.id },
  }));

  return {
    paths: pathsWithParams,
    fallback: true,
  };
};

export default function SingleFournisseurPage({ fournisseurData }) {
  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center">
      <div className={"d-flex flex-row mb-2 justify-content-center col-11"}>
        <div
          className={
            "d-flex flex-row justify-content-center col-11 align-items-center"
          }
        >
          <div className={"col-3 d-flex flex-row justify-content-end"}>
            <FicheContact fournisseurData={fournisseurData}></FicheContact>
          </div>
          <div
            className={
              "d-flex flex-column justify-content-center align-items-center col-8"
            }
          >
            <h2>{fournisseurData.name}</h2>
            <div
              className={"d-flex flex-row justify-content-between col-8"}
              style={{ color: "#95929c" }}
            >
              <p>{fournisseurData.category}</p>
              <p>{fournisseurData.specialty}</p>
            </div>
          </div>
          <div className={"col-3 d-flex flex-row justify-content-start"}>
            <Link href={"/fournisseurs/modifier/" + fournisseurData.id}>
              Modifier
            </Link>
          </div>
        </div>

        <h2></h2>
      </div>
      <div
        className={
          "col-6 d-flex flex-column align-items-center justify-content-center"
        }
      >
        <DeliveryDaysDisplay
          fournisseurData={fournisseurData}
        ></DeliveryDaysDisplay>
        <p className="align-self-end" style={{ color: "#95929c" }}>
          Dernière heure de commande: {fournisseurData.last_order_time}
        </p>
      </div>
      <div className="col-12 d-flex flex-row justify-content-center">
        <FournisseurProduitsDisplay
          fournisseurIngredientsData={fournisseurData.produits}
        ></FournisseurProduitsDisplay>
      </div>
    </div>
  );
}
