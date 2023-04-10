function getRecetteData(id) {
  return {
    id: 1,
    name: "Soupe de poisson",
    quantity: 1,
    unit: "littre",
    genres: [
      { id: 1, name: "français" },
      { id: 2, name: "marseille" },
      { id: 3, name: "mijoté" },
    ],
    category: "plat",
    tastes: [{ id: 1, name: "doux" }],
    duration: 75,
    selected_for_menu: true,
    selling_price: 24.8,
    ingredients_cost: 9.87,
    coefficient: 3.2,
    tva: 10,
    ingredients: [
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
        labels: [
          { id: 1, name: "AOC" },
          { id: 2, name: "AOC" },
          { id: 3, name: "AOC" },
          { id: 4, name: "AOC" },
        ],
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
    ],
    progression: [
      { ordering: 0, text: "faire cuire" },
      { ordering: 2, text: "dresser dans une coupelle en argent" },
      { ordering: 1, text: "couper la cuisson dans une eau glacée" },
    ],
    sous_recette: [
      {
        name: "condiment betterave",
        quantity: 300,
        unit: "gramme",
        link: "https://google.com",
      },
    ],
  };
}

export const getStaticProps = async (context) => {
  //   const recetteId = context.params?.id;
  const recetteData = getRecetteData();
  return {
    props: {
      recetteData,
    },
  };
};

export const getStaticPaths = async () => {
  const data = { stars: [] };
  const pathsWithParams = data.stars.map((star) => ({
    params: { something: star.id },
  }));

  return {
    paths: pathsWithParams,
    fallback: true,
  };
};

export default function SingleRecettePage({ recetteData }) {
  var tastes_string = "";
  if (recetteData.tastes.length > 0) {
    recetteData.tastes.forEach((taste) => (tastes_string += taste.name + "; "));
    tastes_string = tastes_string.substring(0, tastes_string.length - 2);
  }
  var genres_string = "";
  if (recetteData.genres.length > 0) {
    recetteData.genres.forEach((taste) => (genres_string += taste.name + "; "));
    genres_string = genres_string.substring(0, genres_string.length - 2);
  }
  var formatted_duration = recetteData.duration + "min.";
  if (recetteData.duration > 60) {
    formatted_duration =
      (recetteData.duration - (recetteData.duration % 60)) / 60 +
      "h. " +
      (recetteData.duration % 60) +
      "min.";
  }

  return (
    <div className="col-12 d-flex flex-column justify-content-center align-items-center pt-4">
      <div className="d-flex flex-row justify-content-center align-items-start mb-3">
        <h4 style={{ marginBottom: "0px" }}>{recetteData.name}</h4>
        {recetteData.selected_for_menu ? (
          <p
            className="align-self-end"
            style={{
              color: "#f19494",
              marginBottom: "0px",
              marginLeft: "15px",
            }}
          >
            (à la carte)
          </p>
        ) : null}
      </div>

      <div className="d-flex flex-row justify-content-between">
        <div className="d-flex flex-column justify-content-start col-4 align-items-start">
          <p style={{ fontSize: "14px", marginBottom: "0px" }}>
            Quantité:{" "}
            <span style={{ fontSize: "16px" }}>
              {recetteData.quantity + " " + recetteData.unit}
            </span>
          </p>
          <p style={{ fontSize: "14px", marginBottom: "0px" }}>
            Durée:{" "}
            <span style={{ fontSize: "16px" }}>{formatted_duration}</span>
          </p>
          <p style={{ fontSize: "14px", marginBottom: "0px" }}>
            Catégorie:{" "}
            <span style={{ fontSize: "16px" }}>{recetteData.category}</span>
          </p>
          <p style={{ fontSize: "14px", marginBottom: "0px" }}>
            {recetteData.tastes.length > 1 ? "Goûts:" : "Goût:"}{" "}
            <span style={{ fontSize: "16px" }}>{tastes_string}</span>
          </p>
          <p style={{ fontSize: "14px", marginBottom: "0px" }}>
            {recetteData.tastes.length > 1 ? "Genres:" : "Genre:"}{" "}
            <span style={{ fontSize: "16px" }}>{genres_string}</span>
          </p>
        </div>
        <div className="d-flex flex-column justify-content-start col-6 align-items-end">
          <p style={{ fontSize: "14px", marginBottom: "0px" }}>
            Coût matière:{" "}
            <span style={{ fontSize: "16px" }}>
              {recetteData.ingredients_cost + "euro_symbol"}
            </span>
          </p>
          <p style={{ fontSize: "14px", marginBottom: "0px" }}>
            Coefficient:{" "}
            <span style={{ fontSize: "16px" }}>{recetteData.coefficient}</span>
          </p>
          <p style={{ fontSize: "14px", marginBottom: "0px" }}>
            TVA:{" "}
            <span style={{ fontSize: "16px" }}>{recetteData.tva + "%"}</span>
          </p>
          <p style={{ fontSize: "14px", marginBottom: "0px" }}>
            Prix de vente conseillé:{" "}
            <span style={{ fontSize: "16px" }}>
              {recetteData.selling_price + "euro_symbol"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
