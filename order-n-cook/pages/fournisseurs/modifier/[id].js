import { Button } from "reactstrap";
import DeliveryDaysDisplay from "../../../components/Fournisseurs/delivery_days_display";
import FournisseurProduitsDisplay from "../../../components/Fournisseurs/produits_display";
import Link from "next/link";
import FournsiseurName from "../../../components/Fournisseurs/edit_only/granular/name_edit";
import EditFournisseurGeneralData from "../../../components/Fournisseurs/edit_only/granular/general_data_edit";
function getIngredientData() {
  return {
    id: 1,
    name: "Anthès",
    adresse: "12 avenue de la Gare",
    address_line_2: "3e étage",
    postal_code: "12600",
    city: "Villefranche",
    department: "Aveyron",
    country: "France",
    client_code: "CECIESTEST",
    principal_phone_number: "0789654567",
    ordering_phone_number: "0719651567",
    // accounting_phone_number:"0719651567",
    principal_email: "anthes@test.org",
    ordering_email: "anthes@test.org",
    // cc_sales_email:"anthes@test.org",
    // last_time_to_order:"16h",
    category: "Crèmerie",
    specialty: "Maître Frommager",
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
          <div className={"col-3"}>{/* Purposefully empty */}</div>
          <div
            className={
              "d-flex flex-column justify-content-center align-items-center col-8"
            }
          >
            <FournsiseurName fournisseur={fournisseurData}></FournsiseurName>
          </div>
          <div className={"col-3 d-flex flex-row justify-content-start"}>
            <Link href={"/fournisseurs/" + fournisseurData.id}>Quitter</Link>
          </div>
        </div>
      </div>
      <div className={"d-flex flex-col justify-content-between col-8"}>
        <EditFournisseurGeneralData
          fournisseur={fournisseurData}
        ></EditFournisseurGeneralData>
      </div>
      <div className={"col-6 d-flex justify-content-center"}>
        <DeliveryDaysDisplay
          fournisseurData={fournisseurData}
        ></DeliveryDaysDisplay>
      </div>
      <div className="col-12 d-flex flex-row justify-content-center">
        <FournisseurProduitsDisplay
          fournisseurIngredientsData={fournisseurData.produits}
        ></FournisseurProduitsDisplay>
      </div>
    </div>
  );
}
