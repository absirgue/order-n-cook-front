import { Button } from "reactstrap";
import ProgressionElementEditHelper from "./progression_element_edit_dialog";
import AddSection from "./edit_only/add_section";
import AddProgressionElement from "./edit_only/add_progression_element";
var Reorder = require("react-reorder");
function get_progression_data_grouped_and_sorted(recette) {
  const grouped_default_data = recette.progression_elements.reduce(
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
          progression_elements: grouped_default_data[key].sort(function (a, b) {
            if (a.rank < b.rank) {
              return -1;
            }
            if (a.rank > b.rank) {
              return 1;
            }
            return 0;
          }),
        });
      } else {
        default_data.push({
          progression_elements: grouped_default_data[key],
        });
      }
    }
  }
  return default_data;
}

const ProgressionDisplay = ({ recette, is_edit = false }) => {
  const deleteProgressionElement = () => {
    window.alert("Supression");
  };

  const grouped_progression_data =
    get_progression_data_grouped_and_sorted(recette);
  return (
    <div>
      <div className="d-flex flex-column justify-content-start align-items-center mt-3 col-12">
        <h5>Progression</h5>
        {grouped_progression_data.length > 0 ? (
          <div className="col-12">
            {grouped_progression_data.map((group) => (
              <div>
                <div
                  className="d-flex flex-column mt-2"
                  key={"general_div_" + group.section_name}
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

                  {is_edit
                    ? group.progression_elements.map((progression_element) => (
                        <div>
                          <div
                            className="col-12 d-flex flex-row"
                            key={"edit_" + progression_element.id}
                          >
                            <p
                              className="col-11"
                              key={"edit_text_" + progression_element.id}
                            >
                              {progression_element.rank +
                                ". " +
                                progression_element.text}
                            </p>
                            <div className="col-1">
                              <ProgressionElementEditHelper
                                progression_element={progression_element}
                                key={"edit_" + progression_element.id}
                              ></ProgressionElementEditHelper>
                              <Button
                                className="emoji_button col-6"
                                key={"delete_button" + progression_element.id}
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Êtes-vous sûr de vouloir supprimer cet élément de progression ?"
                                    )
                                  )
                                    deleteProgressionElement();
                                }}
                              >
                                🗑
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    : group.progression_elements.map((progression_element) => (
                        <p key={progression_element.id}>
                          {progression_element.rank +
                            ". " +
                            progression_element.text}
                        </p>
                      ))}
                </div>
                {is_edit ? (
                  <AddProgressionElement></AddProgressionElement>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className={"d-flex flex-row justify-content-center col-12"}>
              <i>
                Aucun ingrédient n'a encore été renseigné pour cette recette.
                {is_edit
                  ? ""
                  : " Modifier la recette pour ajouter des éléments de progression."}
              </i>
            </div>
            {is_edit ? (
              <AddProgressionElement
                sans_section={true}
              ></AddProgressionElement>
            ) : null}
          </>
        )}
      </div>
      {is_edit ? <AddSection></AddSection> : null}
    </div>
  );
};

export default ProgressionDisplay;
