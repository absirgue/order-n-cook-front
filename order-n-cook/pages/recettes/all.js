import IngredientListItem from "../../components/Ingredients/Ingredients/page_elements/ingredients_list_item";
import React, { useState, useEffect } from "react";
import { Button, Modal, ModalBody, ModalFooter, Table } from "reactstrap";

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

function getAllIngredientsData() {
  // var list = []
  // for (var i =0; i<100;i++){
  //     list.push({ "id": 1, "name": "Fraise", "category": "fruit", "labels":[{id:1,name:"AOC"},{id:2,name:"AOP"}],"allergenes": [{ "id": 1, "name": "lactose" }] })
  // }
  // for (var i =0; i<100;i++){
  //     list.push({ "id": 1, "name": "Carotte", "category": "légume", "labels":[{id:1,name:"AOC"},{id:2,name:"AOP"}],"allergenes": [{ "id": 1, "name": "lactose" }] })
  // }
  // for (var i =0; i<100;i++){
  //     list.push({ "id": 1, "name": "Boeuf", "category": "viande", "labels":[{id:1,name:"AOC"},{id:2,name:"AOP"}],"allergenes": [{ "id": 1, "name": "lactose" }] })
  // }
  // for (var i =0; i<100;i++){
  //     list.push({ "id": 1, "name": "Poisson", "category": "poisson", "labels":[{id:1,name:"AOC"},{id:2,name:"AOP"}],"allergenes": [{ "id": 1, "name": "lactose" }] })
  // }
  // for (var i =0; i<100;i++){
  //     list.push({ "id": 1, "name": "Pate", "category": "epicerie", "labels":[{id:1,name:"AOC"},{id:2,name:"AOP"}],"allergenes": [{ "id": 1, "name": "lactose" }] })
  // }
  // return list.sort(function (a, b) {
  //     if (a.name < b.name) {
  //       return -1;
  //     }
  //     if (a.name > b.name) {
  //       return 1;
  //     }
  //     return 0;
  //   });
  return [
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
  ].sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
}

export async function getStaticProps() {
  const allIngredientsData = getAllIngredientsData();
  return {
    props: {
      allIngredientsData,
    },
  };
}

// The initial data needs to be grouped and sorted in alphabetical order so that this alphabetical order is
// kept across the differents groupings realised by the user.
function get_initial_data_grouped_and_sorted(allIngredientsData) {
  const grouped_default_data = allIngredientsData.reduce((group, product) => {
    const { name } = product;
    group[name[0]] = group[name[0]] ?? [];
    group[name[0]].push(product);
    return group;
  }, {});
  var default_data = [];

  for (var key in grouped_default_data) {
    if (grouped_default_data.hasOwnProperty(key)) {
      default_data.push({
        group_name: key,
        ingredients: grouped_default_data[key],
      });
    }
  }
  return default_data;
}

export default function AllIngredientsDisplay({ allIngredientsData }) {
  // State variable for the filtered search modal
  const [modalOpen, setModalOpen] = useState(false);

  // State variables for the storage of grouped and sorted data
  const [groupedData, setGroupedData] = useState(
    get_initial_data_grouped_and_sorted(allIngredientsData)
  );
  const [filteredData, setFilteredData] = useState(allIngredientsData);

  // State variables to handle the filtered search
  const [groupingField, setGroupingField] = useState("default");
  const [searchString, setSearchString] = useState("");
  const [allergeneFilter, setAllergeneFilter] = useState("default");
  const [sousCategoryFilter, setsousCategoryFilter] = useState("default");
  const [labelFilter, setLabelFilter] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("default");
  const [onlySeasonFilter, setOnlySeasonFilter] = useState(false);
  const [monthFilter, setMonthFilter] = useState("default");

  // Retrieve all the different categories to display in the filtered search.
  const all_different_categories = Array.from(
    new Set(allIngredientsData.map((ingredient) => ingredient.category))
  );

  // Retrieve all the different labels to display in the filtered search.
  const all_different_labels = Array.from(
    new Set(
      allIngredientsData
        .map((ingredient) => ingredient.labels)
        .flat()
        .map((label) => label.name)
    )
  );

  // Retrieve all the different allergenes to display in the filtered search.
  const all_different_allergenes = Array.from(
    new Set(
      allIngredientsData
        .map((ingredient) => ingredient.allergenes)
        .flat()
        .map((allergene) => allergene.name)
    )
  );

  // Retrieve all the different sous categories to display in the filtered search.
  const all_different_sous_categories = Array.from(
    new Set(allIngredientsData.map((ingredient) => ingredient.sous_category))
  );

  // Group the filtered data according to a given field.
  function group_list_based_on_field(list, groupField) {
    return list.reduce((group, product) => {
      if (groupField == "name" || groupField == "default" || !groupField) {
        const { name } = product;
        group[name[0]] = group[name[0]] ?? [];
        group[name[0]].push(product);
        return group;
      } else if (groupField) {
        if (groupField == "category") {
          const { category } = product;
          group[category] = group[category] ?? [];
          group[category].push(product);
          return group;
        } else if (groupField == "sous_category") {
          const { sous_category } = product;
          group[sous_category] = group[sous_category] ?? [];
          group[sous_category].push(product);
          return group;
        }
      }
    }, {});
  }

  // Sort the groups alphabetically.
  function get_sorted_and_cleaned_groups_data(group_data) {
    var dict_to_array = [];

    for (var key in group_data) {
      if (group_data.hasOwnProperty(key)) {
        dict_to_array.push({ group_name: key, ingredients: group_data[key] });
      }
    }
    return dict_to_array.sort(function (a, b) {
      if (a.group_name < b.group_name) {
        return -1;
      }
      if (a.group_name > b.group_name) {
        return 1;
      }
      return 0;
    });
  }

  // Helper to combine the two grouping operations
  const groupIngredientData = (dataToFilter, groupField) => {
    const groupedIngredients = group_list_based_on_field(
      dataToFilter,
      groupField
    );
    const sorted_and_cleaned_groups_data =
      get_sorted_and_cleaned_groups_data(groupedIngredients);
    setGroupedData(sorted_and_cleaned_groups_data);
  };

  // Reset all search filters to their default values.
  const resetSearchFilters = () => {
    setSearchString("");
    setAllergeneFilter("default");
    setCategoryFilter("default");
    setLabelFilter("default");
    setsousCategoryFilter("default");
    setMonthFilter("default");
    setOnlySeasonFilter(false);
    setModalOpen(true);
  };

  // Perform a filtered search based on the various filters inputted by the user.
  const filteredSearch = () => {
    if (
      searchString != "" ||
      categoryFilter != "default" ||
      labelFilter != "default" ||
      allergeneFilter != "default" ||
      sousCategoryFilter != "default" ||
      monthFilter != "default" ||
      onlySeasonFilter
    ) {
      var results = allIngredientsData;
      if (searchString != "") {
        results = results.filter((ingredient) => {
          if (searchString === "") return allIngredientsData;
          return ingredient.name
            .toLowerCase()
            .includes(searchString.toLowerCase());
        });
      }
      if (categoryFilter != "default") {
        results = results.filter(
          (ingredient) =>
            ingredient.category.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
      if (labelFilter != "default") {
        results = results.filter((ingredient) =>
          ingredient.labels.map((label) => label.name).includes(labelFilter)
        );
      }
      if (allergeneFilter != "default") {
        results = results.filter((ingredient) =>
          ingredient.allergenes
            .map((allergene) => allergene.name)
            .includes(allergeneFilter)
        );
      }
      if (sousCategoryFilter != "default") {
        results = results.filter(
          (ingredient) =>
            ingredient.sous_category.toLowerCase() ===
            sousCategoryFilter.toLowerCase()
        );
      }
      if (monthFilter != "default") {
        results = results.filter(
          (ingredient) => ingredient.season[MONTHS.indexOf(monthFilter)] == true
        );
      }
      if (onlySeasonFilter) {
        const dateHelper = new Date();
        const current_month_number = dateHelper.getMonth();
        results = results.filter(
          (ingredient) => ingredient.season[current_month_number] == true
        );
      }
      groupIngredientData(results, groupingField);
      setFilteredData(results);
    }
    setModalOpen(!modalOpen);
  };

  return (
    <div className="col-12">
      <div className={"d-flex flex-row m-1 mb-2"}>
        <div className={"col-5 d-flex flex-row justify-content-start"}>
          <Button
            className={"btn btn-primary col-6"}
            style={{ textAlign: "start" }}
            color="white"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            🔎 Recherche avancée
          </Button>
          <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
            <div className=" modal-header d-flex flex-row justify-content-end">
              <Button type="button" onClick={() => setModalOpen(!modalOpen)}>
                Fermer
              </Button>
            </div>
            <ModalBody>
              <form className={"d-flex flex-column"}>
                <div className={"d-flex flex-row"}>
                  <input
                    className={"col-9 ps-2 mb-4"}
                    style={{
                      borderRadius: 10,
                      borderColor: "#6C757D",
                      height: "38px",
                    }}
                    placeholder="Par nom de produit"
                    onChange={(e) => setSearchString(e.target.value)}
                    value={searchString}
                    type="search"
                  />
                </div>
                <div className={"d-flex flex-row align-items-baseline"}>
                  <p style={{ fontSize: 15 }}>Par catégorie:</p>
                  <select
                    className={"btn col-6 ps-1 ms-2"}
                    style={{ backgroundColor: "#CDCCCD", textAlign: "start" }}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                    }}
                    value={categoryFilter}
                  >
                    <option disabled value="default">
                      Nom de la catégorie
                    </option>
                    {all_different_categories.map((category) => (
                      <option value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className={"d-flex flex-row align-items-baseline"}>
                  <p style={{ fontSize: 15 }}>Par allergène:</p>
                  <select
                    className={"btn col-6 ps-1 ms-2"}
                    style={{ backgroundColor: "#CDCCCD", textAlign: "start" }}
                    onChange={(e) => {
                      setAllergeneFilter(e.target.value);
                    }}
                    value={allergeneFilter}
                  >
                    <option disabled value="default">
                      Nom de l'allergène
                    </option>
                    {all_different_allergenes.map((allergene) => (
                      <option value={allergene}>{allergene}</option>
                    ))}
                  </select>
                </div>
                <div className={"d-flex flex-row align-items-baseline"}>
                  <p style={{ fontSize: 15 }}>Par label:</p>
                  <select
                    className={"btn col-6 ps-1 ms-2"}
                    style={{ backgroundColor: "#CDCCCD", textAlign: "start" }}
                    onChange={(e) => {
                      setLabelFilter(e.target.value);
                    }}
                    value={labelFilter}
                  >
                    <option disabled value="default">
                      Nom du label
                    </option>
                    {all_different_labels.map((label) => (
                      <option value={label}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className={"d-flex flex-row align-items-baseline"}>
                  <p style={{ fontSize: 15 }}>Par sous catégorie:</p>
                  <select
                    className={"btn col-6 ps-1 ms-2"}
                    style={{ backgroundColor: "#CDCCCD", textAlign: "start" }}
                    onChange={(e) => {
                      setsousCategoryFilter(e.target.value);
                    }}
                    value={sousCategoryFilter}
                  >
                    <option disabled value="default">
                      Nom de la sous catégorie
                    </option>
                    {all_different_sous_categories.map((label) => (
                      <option value={label}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className={"d-flex flex-row align-items-baseline"}>
                  <p style={{ fontSize: 15 }}>Par mois de saisonnalité:</p>
                  <select
                    className={"btn col-6 ps-1 ms-2"}
                    style={{ backgroundColor: "#CDCCCD", textAlign: "start" }}
                    onChange={(e) => {
                      setMonthFilter(e.target.value);
                    }}
                    value={monthFilter}
                  >
                    <option disabled value="default">
                      Nom du mois
                    </option>
                    {MONTHS.map((mois) => (
                      <option value={mois}>{mois}</option>
                    ))}
                  </select>
                </div>
                <div className={"d-flex flex-row align-items-baseline"}>
                  {onlySeasonFilter ? (
                    <input
                      type="checkbox"
                      id="example_checkbox"
                      onChange={(event) => setOnlySeasonFilter(true)}
                      checked
                    />
                  ) : (
                    <input
                      type="checkbox"
                      id="example_checkbox"
                      onChange={(event) => setOnlySeasonFilter(true)}
                    />
                  )}
                  <p style={{ fontSize: 16, marginLeft: "10px" }}>
                    Seulement les produits actuellement de saison
                  </p>
                </div>

                <div className="d-flex flex-row justify-content-end col-12">
                  <button
                    className={"btn"}
                    style={{
                      textDecorationLine: "underline",
                      color: "#95929c",
                    }}
                    onClick={() => resetSearchFilters()}
                  >
                    Réinitialiser les critères
                  </button>
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                type="button"
                className="col-4"
                onClick={() => filteredSearch()}
              >
                Rechercher
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        <div className={"col-7 d-flex flex-row justify-content-end"}>
          <button
            className={"btn"}
            style={{ textDecorationLine: "underline", color: "#6C757D" }}
            onClick={() => {
              setGroupedData(
                get_initial_data_grouped_and_sorted(allIngredientsData)
              );
              setFilteredData(allIngredientsData);
              setGroupingField("default");
            }}
          >
            Réinitialiser
          </button>
          <select
            className={"btn"}
            onChange={(e) => {
              setGroupingField(e.target.value);
              groupIngredientData(filteredData, e.target.value);
            }}
            value={groupingField}
          >
            <option disabled value="default">
              Trier
            </option>
            <option value="name">Par nom</option>
            <option value="category">Par catégorie</option>
            <option value="sous_category">Par sous catégorie</option>
          </select>
        </div>
      </div>
      {groupedData.length > 0 ? (
        <div>
          {groupedData.map((group) => (
            <div>
              <p style={{ background: "#CDCCCD", paddingLeft: "10px" }}>
                {group.group_name}
              </p>
              <Table hover>
                <tbody>
                  {group.ingredients.map((ingredient) => (
                    <IngredientListItem
                      ingredient={ingredient}
                    ></IngredientListItem>
                  ))}
                </tbody>
              </Table>
            </div>
          ))}
        </div>
      ) : (
        <div className={"d-flex flex-row justify-content-center"}>
          <p>
            Aucun ingrédient ne correspond à cette recherche. Si vous n'avez pas
            effectué de recherche, merci de vérifier votre connexion internet
          </p>
        </div>
      )}
    </div>
  );
}
