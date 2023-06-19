import SeasonnalityDisplay from "../../components/Ingredients/Ingredients/page_elements/seasonnality_display";
import ProductListItem from "../../components/Ingredients/Ingredients/page_elements/produit_list_item";

export const getStaticProps = async (context) => {
  const ingredientID = context.params?.id;
  const res = await fetch(
    `http://127.0.0.1:8000/api/ingredients/` + ingredientID
  );

  const ingredientData = await res.json();
  return {
    props: {
      ingredientData,
    },
  };
};

export const getStaticPaths = async () => {
  const res = await fetch(`http://127.0.0.1:8000/api/ingredients/`);
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
      </div>
      {ingredientData.associated_produits.length > 0 ? (
        <div className="col-12 d-flex flex-column align-items-center">
          <h3 className="mt-4 mb-3">
            Vos fournisseurs proposant cet ingrédient
          </h3>
          {ingredientData.associated_produits.map((produit) => (
            <ProductListItem
              produit={produit}
              ingredient={ingredientData}
            ></ProductListItem>
          ))}
        </div>
      ) : null}
    </div>
  );
}
