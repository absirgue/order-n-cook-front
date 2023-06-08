import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, Table } from "reactstrap";
import FournisseurListItem from "../../components/Fournisseurs/fournisseur_list_item";
import CreateNewFournisseurButton from "../../components/Fournisseurs/create_fournisseur_button";
const DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`http://127.0.0.1:8000/api/fournisseurs/`);
  let allFournisseursData = await res.json();
  allFournisseursData = allFournisseursData.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  // Pass data to the page via props
  return { props: { allFournisseursData } };
}

// The initial data needs to be grouped and sorted in alphabetical order so that this alphabetical order is
// kept across the differents groupings realised by the user.
function get_initial_data_grouped_and_sorted(allFournisseursData) {
  const grouped_default_data = allFournisseursData.reduce((group, product) => {
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
        fournisseurs: grouped_default_data[key],
      });
    }
  }
  return default_data;
}

export default function AllFournisseursData({ allFournisseursData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [groupedData, setGroupedData] = useState(
    get_initial_data_grouped_and_sorted(allFournisseursData)
  );
  const [filteredData, setFilteredData] = useState(allFournisseursData);
  const [groupingField, setGroupingField] = useState("default");
  const [searchString, setSearchString] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("default");
  const [dayOfTheWeek, setDayOfTheWeek] = useState("default");

  // Retrieve all the different categories to display in the filtered search.
  const all_different_categories = Array.from(
    new Set(allFournisseursData.map((fournisseur) => fournisseur.category))
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
        }
      }
    }, {});
  }

  // Sort the groups alphabetically.
  function get_sorted_and_cleaned_groups_data(group_data) {
    var dict_to_array = [];

    for (var key in group_data) {
      if (group_data.hasOwnProperty(key)) {
        dict_to_array.push({ group_name: key, fournisseurs: group_data[key] });
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
  const groupFournisseursData = (dataToFilter, groupField) => {
    const groupedFournisseurs = group_list_based_on_field(
      dataToFilter,
      groupField
    );
    const sorted_and_cleaned_groups_data =
      get_sorted_and_cleaned_groups_data(groupedFournisseurs);
    setGroupedData(sorted_and_cleaned_groups_data);
  };

  // Reset all search filters to their default values.
  const resetSearchFilters = () => {
    setSearchString("");
    setCategoryFilter("default");
    setDayOfTheWeek("default");
  };

  // Perform a filtered search based on the various filters inputted by the user.
  const filteredSearch = () => {
    if (
      searchString != "" ||
      categoryFilter != "default" ||
      dayOfTheWeek != "default"
    ) {
      var results = allFournisseursData;
      if (searchString != "") {
        results = results.filter((ingredient) => {
          if (searchString === "") return allFournisseursData;
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
      if (dayOfTheWeek != "default") {
        results = results.filter((fournisseur) => {
          if (dayOfTheWeek == "Lundi") {
            return fournisseur.delivers_monday;
          } else if (dayOfTheWeek == "Mardi") {
            return fournisseur.delivers_tuesday;
          } else if (dayOfTheWeek == "Mercredi") {
            return fournisseur.delivers_wednesday;
          } else if (dayOfTheWeek == "Jeudi") {
            return fournisseur.delivers_thursday;
          } else if (dayOfTheWeek == "Vendredi") {
            return fournisseur.delivers_friday;
          } else if (dayOfTheWeek == "Samedi") {
            return fournisseur.delivers_saturday;
          } else if (dayOfTheWeek == "Dimanche") {
            return fournisseur.delivers_sunday;
          } else {
            return false;
          }
        });
      }
      groupFournisseursData(results, groupingField);
      setFilteredData(results);
    }
    setModalOpen(!modalOpen);
  };

  return (
    <div className="col-12 col-lg-10">
      <div className={"d-flex flex-row col-12 mt-1 mb-2 justify-content-end"}>
        <CreateNewFournisseurButton></CreateNewFournisseurButton>
      </div>
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
                  <p style={{ fontSize: 15 }}>Par jour de livraison:</p>
                  <select
                    className={"btn col-6 ps-1 ms-2"}
                    style={{ backgroundColor: "#CDCCCD", textAlign: "start" }}
                    onChange={(e) => {
                      setDayOfTheWeek(e.target.value);
                    }}
                    value={dayOfTheWeek}
                  >
                    <option disabled value="default">
                      Nom du jour
                    </option>
                    {DAYS.map((day) => (
                      <option value={day}>{day}</option>
                    ))}
                  </select>
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
                get_initial_data_grouped_and_sorted(allFournisseursData)
              );
              setFilteredData(allFournisseursData);
              setGroupingField("default");
              resetSearchFilters();
            }}
          >
            Réinitialiser
          </button>
          <select
            className={"btn"}
            onChange={(e) => {
              setGroupingField(e.target.value);
              groupFournisseursData(filteredData, e.target.value);
            }}
            value={groupingField}
          >
            <option disabled value="default">
              Trier
            </option>
            <option value="name">Par nom</option>
            <option value="category">Par catégorie</option>
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
                  {group.fournisseurs.map((fournisseur) => (
                    <FournisseurListItem
                      fournisseur={fournisseur}
                    ></FournisseurListItem>
                  ))}
                </tbody>
              </Table>
            </div>
          ))}
        </div>
      ) : (
        <div className={"d-flex flex-row justify-content-center"}>
          {allFournisseursData.length > 0 ? (
            <p>
              Aucun fournisseur ne correspond à cette recherche. Si vous n'avez
              pas effectué de recherche, merci de vérifier votre connexion
              internet.
            </p>
          ) : (
            <p>
              Aucun fournisseur n'a encore été créé. Si ce n'est pas le cas,
              merci de vérifier votre connexion internet
            </p>
          )}
        </div>
      )}
    </div>
  );
}
