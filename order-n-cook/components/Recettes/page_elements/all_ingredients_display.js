import { Table } from "reactstrap";
import RecetteIngredientListItem from "./recette_ingredient_list_item";
import AddIngredient from "./edit_only/add_ingredient";
import AddSection from "./edit_only/add_section";
function get_ingredient_data_grouped_and_sorted(recette) {
  if (recette.ingredients) {
    const grouped_default_data = recette.ingredients.reduce(
      (group, product) => {
        const { section } = product;
        group[section] = group[section] ?? [];
        group[section].push(product);
        return group;
      },
      {}
    );
    grouped_default_data;
    var default_data = [];

    for (var key in grouped_default_data) {
      if (grouped_default_data.hasOwnProperty(key)) {
        const related_section = recette.sections.filter(
          (section) => section.number == key
        )[0];
        if (related_section) {
          default_data.push({
            section_name: related_section.name,
            section_id: related_section.id,
            ingredients: grouped_default_data[key],
          });
        } else {
          default_data.push({
            ingredients: grouped_default_data[key],
          });
        }
      }
    }
    return default_data;
  } else {
    return null;
  }
}

const AllRecetteIngredientsDisplay = ({ recette, is_edit = false }) => {
  const grouped_ingredient_data =
    get_ingredient_data_grouped_and_sorted(recette);

  return (
    <div className="d-flex flex-column justify-content-start align-items-center col-12 mt-4">
      <h5>Ingrédients</h5>
      {grouped_ingredient_data.length > 0 ? (
        <div className="col-12">
          {grouped_ingredient_data.map((group) => (
            <div
              className="d-flex flex-column"
              key={group.section_id ? group.section_id : "sans_section"}
            >
              {group.section_name ? (
                <p
                  style={{
                    background: "#CDCCCD",
                    paddingLeft: "10px",
                  }}
                >
                  {group.section_name}
                </p>
              ) : null}

              <Table hover>
                <tbody>
                  {group.ingredients.map((ingredient) => {
                    return (
                      <RecetteIngredientListItem
                        ingredient={ingredient}
                        key={ingredient.id}
                        is_edit={is_edit}
                      ></RecetteIngredientListItem>
                    );
                  })}
                </tbody>
              </Table>
              {is_edit ? (
                <AddIngredient
                  section_id={group.section_id}
                  sans_section={group.section_id ? false : true}
                ></AddIngredient>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="col-12 d-flex flex-column">
          <div className={"d-flex flex-row justify-content-center"}>
            <i>
              Aucun ingrédient n'a encore été renseigné pour cette recette.
              {is_edit
                ? ""
                : " Modifier la recette pour ajouter des ingrédients."}
            </i>
          </div>
          {is_edit ? <AddIngredient sans_section={true}></AddIngredient> : null}
        </div>
      )}
      {is_edit ? <AddSection></AddSection> : null}
    </div>
  );
};

export default AllRecetteIngredientsDisplay;
