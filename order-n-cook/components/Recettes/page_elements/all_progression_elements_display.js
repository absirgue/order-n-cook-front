import { Button } from "reactstrap";
import ProgressionElementEditHelper from "./edit_only/modification_buttons/progression_element_edit_dialog";
import AddSection from "./edit_only/add_buttons/add_section";
import AddProgressionElement from "./edit_only/add_buttons/add_progression_element";
import DeleteButton from "./edit_only/modification_buttons/delete_button";
import ChangeSectionButton from "./edit_only/modification_buttons/change_section_button";
import FlecheHautButton from "./edit_only/modification_buttons/fleche_haut";
import FlecheBasButton from "./edit_only/modification_buttons/fleche_bas";
import { useState } from "react";
import { strUcFirst } from "./helper_functions/helpers";

function get_progression_data_grouped_and_sorted(recette) {
  if (recette.progression_elements && recette.progression_elements.length > 0) {
    const grouped_default_data = recette.progression_elements.reduce(
      (group, product) => {
        const { section } = product;
        group[section] = group[section] ?? [];
        group[section].push(product);
        return group;
      },
      {}
    );
    var default_data = [];

    for (var key in grouped_default_data) {
      if (
        grouped_default_data.hasOwnProperty(key) &&
        recette.sections.length > 0
      ) {
        const related_section = recette.sections.filter(
          (section) => section.number == key
        )[0];
        if (related_section) {
          default_data.push({
            section_name: related_section.name,
            section_number: related_section.number,
            section_min_rank: Math.min(
              ...grouped_default_data[key].map((section) => section.rank)
            ),
            section_max_rank: Math.max(
              ...grouped_default_data[key].map((section) => section.rank)
            ),
            progression_elements: grouped_default_data[key].sort(function (
              a,
              b
            ) {
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
            progression_elements: grouped_default_data[key].sort(function (
              a,
              b
            ) {
              if (a.rank < b.rank) {
                return -1;
              }
              if (a.rank > b.rank) {
                return 1;
              }
              return 0;
            }),
          });
        }
      } else {
        for (var value in grouped_default_data) {
          if (grouped_default_data.hasOwnProperty(key)) {
            default_data.push({
              progression_elements: grouped_default_data[key].sort(function (
                a,
                b
              ) {
                if (a.rank < b.rank) {
                  return -1;
                }
                if (a.rank > b.rank) {
                  return 1;
                }
                return 0;
              }),
            });
          }
        }
      }
    }
    return default_data;
  } else {
    return [];
  }
}

const ProgressionDisplay = ({ recette, is_edit = false }) => {
  const get_initial_all_sections_value = () => {
    if (recette.sections && recette.sections.length > 0) {
      return recette.sections.filter(
        (section) =>
          recette.progression_elements
            .map((element) => element.section)
            .indexOf(section.number) >= 0
      );
    } else {
      return [];
    }
  };
  const [allSections, setAllSections] = useState(
    get_initial_all_sections_value()
  );

  const get_unused_sections_value = () => {
    if (
      recette.sections &&
      recette.sections.length > 0 &&
      recette.progression_elements &&
      recette.progression_elements.length > 0
    ) {
      return recette.sections.filter(
        (section) =>
          recette.progression_elements
            .map((element) => element.section)
            .indexOf(section.number) == -1
      );
    } else if (
      recette.sections &&
      recette.sections.length > 0 &&
      recette.progression_elements
    ) {
      return recette.sections;
    } else {
      return [];
    }
  };

  const [allUnusedSections, setAllUnusedSections] = useState(
    get_unused_sections_value()
  );
  const [newlyImporterdSections, setNewlyImporterdSections] = useState([]);

  const grouped_progression_data =
    get_progression_data_grouped_and_sorted(recette);
  return (
    <div>
      <div className="d-flex flex-column justify-content-start align-items-center mt-3 col-12">
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
          Progression
        </p>
        {is_edit ? (
          <AddSection
            recette={recette}
            unused_sections={allUnusedSections}
            sectionrecette={recette}
            set_section_options={setAllSections}
            all_sections={allSections}
            newly_imported_sections={newlyImporterdSections}
            set_newly_imported_sections={setNewlyImporterdSections}
            setAllUnusedSections={setAllUnusedSections}
          ></AddSection>
        ) : null}
        {grouped_progression_data.length > 0 ? (
          <div className="col-12">
            {grouped_progression_data.map((group) => (
              <div>
                <div
                  className="d-flex flex-column mt-2"
                  key={"general_div_" + group.section_name}
                >
                  {group.section_name ? (
                    <h5 style={{ fontSize: "18px", fontWeight: "600" }}>
                      {strUcFirst(group.section_name)}
                    </h5>
                  ) : null}

                  {is_edit
                    ? group.progression_elements.map((progression_element) => (
                        <div>
                          <div
                            className="col-12 d-flex flex-row align-items-center"
                            key={"edit_" + progression_element.id}
                          >
                            <p
                              className="col-10"
                              key={"edit_text_" + progression_element.id}
                            >
                              {progression_element.rank +
                                ". " +
                                progression_element.text}
                            </p>
                            <div className={"col-1 d-flex flex-row"}>
                              <ChangeSectionButton
                                is_progression={true}
                                all_sections={allSections}
                                element={progression_element}
                              ></ChangeSectionButton>
                              <div
                                className={
                                  "d-flex flex-column justify-content-center"
                                }
                              >
                                {progression_element.rank ==
                                group.section_min_rank ? null : (
                                  <FlecheHautButton
                                    recette_id={recette.id}
                                    element={progression_element}
                                  ></FlecheHautButton>
                                )}
                                {progression_element.rank ==
                                group.section_max_rank ? null : (
                                  <FlecheBasButton
                                    recette_id={recette.id}
                                    element={progression_element}
                                  ></FlecheBasButton>
                                )}
                              </div>
                            </div>
                            <div className="col-1 d-flex flez-row align-items-center">
                              <ProgressionElementEditHelper
                                recette_id={recette.id}
                                progression_element={progression_element}
                                key={"edit_" + progression_element.id}
                              ></ProgressionElementEditHelper>
                              <DeleteButton
                                element={progression_element}
                                is_progression={true}
                                recette_id={recette.id}
                              ></DeleteButton>
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
                  <AddProgressionElement
                    section_number={group.section_number}
                    section_max_number={group.section_max_number}
                    recette={recette}
                    sans_section={group.section_id ? false : true}
                  ></AddProgressionElement>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className={"d-flex flex-row justify-content-center col-12"}>
              <i>
                Aucun élément de progression n'a encore été renseigné pour cette
                recette.
                {is_edit
                  ? ""
                  : " Modifier la recette pour ajouter des éléments de progression."}
              </i>
            </div>
            {is_edit ? (
              <AddProgressionElement
                recette={recette}
                sans_section={true}
              ></AddProgressionElement>
            ) : null}
          </>
        )}
      </div>
      {is_edit && newlyImporterdSections.length > 0
        ? newlyImporterdSections
            .filter(
              (section) =>
                recette.progression_elements
                  .map((element) => element.section)
                  .indexOf(section.number) == -1
            )
            .map((section) => (
              <div
                className="d-flex flex-column col-12"
                key={section.id ? section.id : "sans_section"}
              >
                <h5 style={{ fontSize: "18px", fontWeight: "600" }}>
                  {strUcFirst(section.name)}
                </h5>
                <AddProgressionElement
                  section_number={section.number}
                  recette={recette}
                ></AddProgressionElement>
              </div>
            ))
        : null}
    </div>
  );
};

export default ProgressionDisplay;
