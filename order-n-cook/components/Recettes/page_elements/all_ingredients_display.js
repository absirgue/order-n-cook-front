import { Table } from "reactstrap";
import RecetteIngredientListItem from "./list_items/recette_ingredient_list_item";
import AddIngredient from "./edit_only/add_buttons/add_ingredient";
import AddSection from "./edit_only/add_buttons/add_section";
import { useState } from "react";

/**
 * Shows all the ingredients of the Recette on display.
 *
 * @param recette the Recette object on display
 * @returns the ingredients grouped by section and ranked in alpahetical order.
 */
function get_ingredient_data_grouped_and_sorted(recette) {
  if (recette.ingredients && recette.ingredients.length > 0) {
    const grouped_default_data = recette.ingredients.reduce(
      (group, product) => {
        const { section } = product;
        group[section] = group[section] ?? [];
        group[section].push(product);
        return group;
      },
      {}
    );

    console.log("HERE GOUPED DATA");
    console.log(grouped_default_data);
    var default_data = [];

    for (var key in grouped_default_data) {
      if (grouped_default_data.hasOwnProperty(key)) {
        let related_section = null;
        if (recette.sections && recette.sections.length > 0) {
          related_section = recette.sections.filter(
            (section) => section.number == key
          )[0];
        }
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
    return [];
  }
}

const AllRecetteIngredientsDisplay = ({ recette, is_edit = false }) => {
  const grouped_ingredient_data =
    get_ingredient_data_grouped_and_sorted(recette);
  const [newlyImportedSections, setNewlyImportedSections] = useState([]);
  const get_initial_all_sections_value = () => {
    if (recette.sections && recette.sections.length > 0) {
      return recette.sections.filter(
        (section) =>
          recette.ingredients
            .map((element) => element.section)
            .indexOf(section.number) >= 0
      );
    } else {
      return [];
    }
  };
  const get_unused_sections_value = () => {
    console.log("CHECKING UNUSED SECTION");
    if (recette.sections && recette.sections.length > 0) {
      console.log("ENTERED THE CHECK HEHEHEHHEHH");
      console.log(recette.sections);
      return recette.sections.filter(
        (section) =>
          recette.ingredients
            .map((element) => element.section)
            .indexOf(section.number) == -1
      );
    } else {
      return [];
    }
  };
  const [allSections, setAllSections] = useState(
    get_initial_all_sections_value()
  );
  const [allUnusedSections, setAllUnusedSections] = useState(
    get_unused_sections_value()
  );

  return (
    <div className="d-flex flex-column justify-content-start align-items-center col-12 mt-4">
      <p
        className="col-12"
        style={{
          background: "#CDCCCD",
          paddingLeft: "10px",
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "500",
        }}
      >
        Ingrédients
      </p>
      {grouped_ingredient_data.length > 0 ? (
        <div className="col-12">
          {grouped_ingredient_data.map((group) => (
            <div
              className="d-flex flex-column"
              key={group.section_id ? group.section_id : "sans_section"}
            >
              {group.section_name ? (
                <h5 style={{ fontSize: "18px", fontWeight: "600" }}>
                  {group.section_name}
                </h5>
              ) : null}

              <Table hover>
                <tbody>
                  {group.ingredients.map((ingredient) => {
                    return (
                      <RecetteIngredientListItem
                        ingredient={ingredient}
                        key={ingredient.id}
                        is_edit={is_edit}
                        all_sections={allSections}
                        recette_id={recette.id}
                      ></RecetteIngredientListItem>
                    );
                  })}
                </tbody>
              </Table>
              {is_edit ? (
                <AddIngredient
                  section_id={group.section_id}
                  sans_section={group.section_id ? false : true}
                  recette={recette}
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
          {is_edit ? (
            <AddIngredient
              sans_section={true}
              recette={recette}
            ></AddIngredient>
          ) : null}
        </div>
      )}
      {is_edit && newlyImportedSections.length > 0
        ? newlyImportedSections
            .filter(
              (section) =>
                recette.ingredients
                  .map((element) => element.section)
                  .indexOf(section.number) == -1
            )
            .map((section) => (
              <div
                className="d-flex flex-column col-12"
                key={section.id ? section.id : "sans_section"}
              >
                <p
                  style={{
                    background: "#CDCCCD",
                    paddingLeft: "10px",
                  }}
                >
                  {section.name}
                </p>
                <AddIngredient
                  section_id={section.number}
                  recette={recette}
                ></AddIngredient>
              </div>
            ))
        : null}
      {is_edit ? (
        <AddSection
          unused_sections={allUnusedSections}
          sectionrecette={recette}
          set_section_options={setAllSections}
          all_sections={allSections}
          newly_imported_sections={newlyImportedSections}
          set_newly_imported_sections={setNewlyImportedSections}
          recette={recette}
          setAllUnusedSections={setAllUnusedSections}
        ></AddSection>
      ) : null}
    </div>
  );
};

export default AllRecetteIngredientsDisplay;
