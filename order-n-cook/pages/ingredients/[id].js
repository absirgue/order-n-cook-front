import SeasonnalityDisplay from "../../components/Ingredients/Ingredients/page_elements/seasonnality_display";

function getIngredientData(id) {
  const list = [
    {
      id: 1,
      name: "Fraise",
      category: "fruit",
      sous_category: "fruit rouge",
      labels: [
        { id: 1, name: "AOC" },
        { id: 2, name: "AOP" },
      ],
      allergenes: [{ id: 1, name: "lactose" }],
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
    },
    {
      id: 2,
      name: "Artichaut",
      category: "légume",
      sous_category: "légume feuille",
      labels: [{ id: 1, name: "AOC" }],
      allergenes: [],
      season: [
        true,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        true,
        true,
        true,
        true,
      ],
    },
    {
      id: 3,
      name: "Côte de boeuf",
      category: "viande",
      sous_category: "viande rouge",
      labels: [],
      allergenes: [{ id: 1, name: "lactose" }],
      season: [
        true,
        true,
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        false,
        true,
        true,
      ],
    },
    {
      id: 4,
      name: "Sole",
      category: "poisson",
      sous_category: "poisson à chair blanche",
      labels: [],
      allergenes: [{ id: 1, name: "lactose" }],
      season: [
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        true,
        true,
        true,
        true,
      ],
    },
    {
      id: 5,
      name: "Carotte",
      category: "légume",
      sous_category: "légume racine",
      labels: [],
      allergenes: [
        { id: 1, name: "lactose" },
        { id: 2, name: "noix" },
      ],
      season: [
        true,
        true,
        true,
        true,
        false,
        false,
        true,
        false,
        false,
        true,
        true,
        true,
      ],
    },
    {
      id: 6,
      name: "Framboise",
      sous_category: "fruit rouge",
      category: "fruit",
      labels: [],
      allergenes: [{ id: 1, name: "lactose" }],
      season: [
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        false,
        true,
        true,
        true,
        true,
      ],
    },
  ];

  return list.filter((ingredient) => ingredient.id == id)[0];
}

export const getStaticProps = async (context) => {
  const ingredientID = context.params?.id;
  const res = await fetch(
    `http://127.0.0.1:8000/api/general/ingredients/` + ingredientID
  );

  const ingredientData = await res.json();
  return {
    props: {
      ingredientData,
    },
  };
};

export const getStaticPaths = async () => {
  const res = await fetch(`http://127.0.0.1:8000/api/general/ingredients/`);
  const allIngredientsData = await res.json();
  const pathsWithParams = allIngredientsData.map((ingredient) => ({
    params: { id: ingredient.id.toString() },
  }));

  return {
    paths: pathsWithParams,
    fallback: true,
  };
};

export default function SingleIngredientPage({ ingredientData }) {
  return (
    <div className="col-12">
      <div className={"d-flex flex-row m-1 mb-2 justify-content-center"}>
        <div className={"d-flex flex-row justify-content-center col-12"}>
          <div className={"col-3 d-flex flex-row justify-content-center"}>
            THIS DIV WILL CONTAIN A PICTURE
          </div>
          <div
            className={
              "d-flex flex-column justify-content-center align-items-center col-6"
            }
          >
            <h2>{ingredientData.name}</h2>
            <div
              className={"d-flex flex-row justify-content-between col-8"}
              style={{ color: "#95929c" }}
            >
              <p>{ingredientData.category}</p>
              <p>{ingredientData.sous_category}</p>
            </div>
            <div className={"col-8"}>
              <SeasonnalityDisplay
                ingredient_data={ingredientData}
              ></SeasonnalityDisplay>
            </div>
          </div>
          <div className={"col-3"}>{/* This div is purposefully empty */}</div>
        </div>

        <h2></h2>
      </div>
    </div>
  );
}
